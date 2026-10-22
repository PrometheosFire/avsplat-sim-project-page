# AVSplat-Sim Project Page

Static GitHub Pages site for the thesis project.

Public URL: https://prometheosfire.github.io/avsplat-sim-project-page/

## Media

The original six videos and cleaning stills come from the thesis presentation `docs/AVSplat-Sim-15min-general-audience.pptx` in the thesis repository. Its source recordings and frame sequences live under `docs/Media/` there. The presentation's synchronized compositions were reused, with panel labels added for the web. The additional `scene_099` video is a clean five-camera export from its trained reconstruction checkpoint.

The page leads with simulation, followed by a shared five-camera scene viewer, the abstract, and the remaining pipeline features. The media-first order and scene buttons take inspiration from the [OmniRe project page](https://ziyc.github.io/omnire/); the page retains its own styling and content.

| Web Asset | Presentation Source | Playback |
| --- | --- | --- |
| [assets/videos/reconstruction-rig-1.mp4](assets/videos/reconstruction-rig-1.mp4) | `scene_021`: slide 14, embedded `media4.mp4` | 200 frames at 10 fps; 20 s |
| [assets/videos/reconstruction-rig-2.mp4](assets/videos/reconstruction-rig-2.mp4) | `scene_024`: slide 15, embedded `media5.mp4` | 200 frames at 10 fps; 20 s |
| [assets/videos/scene_099.mp4](assets/videos/scene_099.mp4) | `scene_099`: clean original-trajectory checkpoint export, described below | 200 frames at 10 fps; 20 s |
| [assets/videos/dynamic-agents.mp4](assets/videos/dynamic-agents.mp4) | Slide 16, embedded `media6.mp4` | 200 frames at 10 fps; 20 s |
| [assets/videos/lateral-offsets.mp4](assets/videos/lateral-offsets.mp4) | Slide 17, embedded `media7.mp4` | 200 frames at 10 fps; 20 s |
| [assets/images/shifted-render.jpg](assets/images/shifted-render.jpg), [assets/images/diffusion-cleaned.jpg](assets/images/diffusion-cleaned.jpg) | Slide 18, embedded `image43.png` and `image44.png` | Image-cleaning stage, not retrained renders |
| [assets/videos/pseudo-view-loop.mp4](assets/videos/pseudo-view-loop.mp4) | Slide 19, embedded `media8.mp4` | 200 frames at 10 fps; 20 s |
| [assets/videos/closed-loop-simulation.mp4](assets/videos/closed-loop-simulation.mp4) | Slide 20, embedded `media9.mp4`, first 2 s removed | 295 frames at 179/6 fps; about 9.89 s; original playback speed |

The existing rig clips were matched against the dataset-labeled source frames in `docs/Media/Scene_021/Round_3/full/frames/original/` and `docs/Media/Scene_024/render/full/frames/original/`. The selector uses the dataset IDs rather than presentation-order numbers.

For `scene_099`, the AVSplat-Sim renderer `src/gsplat_training/render_standalone.py` was run with the saved configuration `results/4dgs/wayve101/scene_099/25_rendered_ddd17ed7/.hydra/config.yaml`, overriding `rendering.render_modes=[full]`, `rendering.render.save_video=false`, and the output directory. This reuses the saved checkpoint without retraining and excludes debug boxes. Each of the five cameras has 200 synchronized original-trajectory frames. Camera order is `camera8`, `camera1`, `camera10` above, then `camera7` and `camera9` below, matching the existing rigs. The web composition is 1920 by 722 pixels, encoded from those images at 10 input fps.

## Updating Media

Keep video files in `assets/videos/`, matching poster JPEGs in `assets/posters/`, and still comparisons in `assets/images/`. Update the relevant relative paths and captions in `index.html`. All players use `preload="none"`, so opening the page does not download the full video library.

The pipeline's source MP4s encode 200 frames at 30 fps (about 6.67 seconds), three times the recorded driving speed. Rebuild from source images at **10 input frames per second**, or retime those MP4s to 20 seconds while retaining all 200 frames. Changing only the output frame rate does not correct playback speed. The presentation's reconstruction clips are already corrected to 10 fps: do not slow them again. Preserve screen-recording timing separately.

Use H.264 video with `yuv420p` pixels and MP4 fast-start metadata for browser playback. Keep each file below GitHub's 100 MB per-file limit. Do not crop the five-camera grids or comparison panels to fit a different aspect ratio.

## Adding a Scene

Add the new MP4 and poster under the existing asset directories, then add a button inside `.scene-selector` in `index.html`, following this pattern with the new files' actual paths:

```html
<button type="button" aria-pressed="false" aria-controls="scene-video"
			data-scene-src="assets/videos/scene_100.mp4"
			data-scene-poster="assets/posters/scene_100.jpg">scene_100</button>
```

No JavaScript change is required. `site.js` switches the source, poster, accessible label, selected state, and fallback links. A new scene starts from the beginning; playback resumes only if the previous scene was playing. Native buttons support keyboard focus and Enter/Space activation. Add the corresponding direct link to the `<noscript>` fallback too.

## Pseudo-View Diagram

The interactive diagram is embedded in `index.html` at `#loop-diagram`, with scoped styling in `loop-diagram.css` and interactions in `loop-diagram.js`. Incremental is initially selected and appears on the left. Switching modes preserves the selected round. The existing full-size cleaning comparison below it is shared rather than duplicated.

The example schedules follow `scripts/difix_common.py::resolve_schedule` in AVSplat-Sim. Cumulative mode cleans all reached offsets; incremental mode cleans only the newest offset. Both retain all earlier bank entries. The final round trains and renders without another cleaning or append stage. The schematic shows the cleaning schedule, not a guarantee of reconstruction quality. If the example changes, update its JSON schedules, labels, and descriptions together.

## Deployment

The site is served from the root of the `main` branch. Push updates to that branch to publish them without changing the URL.