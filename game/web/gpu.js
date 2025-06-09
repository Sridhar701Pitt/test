export async function startGpu() {
    if (!navigator.gpu) {
        console.error('WebGPU not supported');
        return;
    }

    const canvas = document.getElementById('gpu-canvas');
    if (!canvas) {
        console.error('GPU canvas missing');
        return;
    }

    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter.requestDevice();
    const context = canvas.getContext('webgpu');
    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({ device, format, alphaMode: 'opaque' });

    const uniformBuffer = device.createBuffer({
        size: 8,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    let currentScore = 0;

    const shaderModule = device.createShaderModule({
        code: `
struct Uniforms { time : f32, score : f32 };
@group(0) @binding(0) var<uniform> uniforms : Uniforms;

@vertex
fn vs_main(@builtin(vertex_index) VertexIndex : u32) -> @builtin(position) vec4<f32> {
    var pos = array<vec2<f32>, 3>(
        vec2<f32>(-1.0, -1.0),
        vec2<f32>(3.0, -1.0),
        vec2<f32>(-1.0, 3.0)
    );
    return vec4<f32>(pos[VertexIndex], 0.0, 1.0);
}

@fragment
fn fs_main(@builtin(position) pos: vec4<f32>) -> @location(0) vec4<f32> {
    let base = uniforms.time + uniforms.score * 0.1;
    let color = vec3<f32>(
        abs(sin(pos.x * 0.01 + base)),
        abs(cos(pos.y * 0.01 + base)),
        abs(sin((pos.x + pos.y) * 0.01 + base))
    );
    return vec4<f32>(color, 1.0);
}
        `,
    });

    const pipeline = device.createRenderPipeline({
        layout: 'auto',
        vertex: {
            module: shaderModule,
            entryPoint: 'vs_main',
        },
        fragment: {
            module: shaderModule,
            entryPoint: 'fs_main',
            targets: [{ format }],
        },
        primitive: { topology: 'triangle-list' },
    });

    const bindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
    });

    function frame(time) {
        const commandEncoder = device.createCommandEncoder();
        const pass = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: context.getCurrentTexture().createView(),
                loadOp: 'clear',
                storeOp: 'store',
            }],
        });

        device.queue.writeBuffer(
            uniformBuffer,
            0,
            new Float32Array([time / 1000, currentScore])
        );
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, bindGroup);
        pass.draw(3, 1, 0, 0);
        pass.end();
        device.queue.submit([commandEncoder.finish()]);
        requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
    return {
        setScore: (val) => {
            currentScore = val;
        },
    };
}
