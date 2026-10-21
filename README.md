# AVSplat-Sim Project Page

Static GitHub Pages site for the thesis project.

Public URL: https://prometheosfire.github.io/avsplat-sim-project-page/

## Media

The six videos and cleaning stills come from the thesis presentation `docs/AVSplat-Sim-15min-general-audience.pptx` in the thesis repository. Its source recordings and frame sequences live under `docs/Media/` there. The presentation's synchronized compositions were reused, with panel labels added for the web. The main drive-through appears under the title; the remaining media appear in the three topic sections.

| Web Asset | Presentation Source | Playback |
| --- | --- | --- |
| [assets/videos/reconstruction-rig-1.mp4](assets/videos/reconstruction-rig-1.mp4) | Slide 14, embedded `media4.mp4` | 200 frames at 10 fps; 20 s |
| [assets/videos/reconstruction-rig-2.mp4](assets/videos/reconstruction-rig-2.mp4) | Slide 15, embedded `media5.mp4` | 200 frames at 10 fps; 20 s |
| [assets/videos/dynamic-agents.mp4](assets/videos/dynamic-agents.mp4) | Slide 16, embedded `media6.mp4` | 200 frames at 10 fps; 20 s |
| [assets/videos/lateral-offsets.mp4](assets/videos/lateral-offsets.mp4) | Slide 17, embedded `media7.mp4` | 200 frames at 10 fps; 20 s |
| [assets/images/shifted-render.jpg](assets/images/shifted-render.jpg), [assets/images/diffusion-cleaned.jpg](assets/images/diffusion-cleaned.jpg) | Slide 18, embedded `image43.png` and `image44.png` | Image-cleaning stage, not retrained renders |
| [assets/videos/pseudo-view-loop.mp4](assets/videos/pseudo-view-loop.mp4) | Slide 19, embedded `media8.mp4` | 200 frames at 10 fps; 20 s |
| [assets/videos/closed-loop-simulation.mp4](assets/videos/closed-loop-simulation.mp4) | Slide 20, embedded `media9.mp4` | Screen recording; original timing preserved |

## Updating Media

Keep video files in `assets/videos/`, matching poster JPEGs in `assets/posters/`, and still comparisons in `assets/images/`. Update the relevant relative paths and captions in `index.html`. All players use `preload="none"`, so opening the page does not download the full video library.

The pipeline's source MP4s encode 200 frames at 30 fps (about 6.67 seconds), three times the recorded driving speed. Rebuild from source images at **10 input frames per second**, or retime those MP4s to 20 seconds while retaining all 200 frames. Changing only the output frame rate does not correct playback speed. The presentation's reconstruction clips are already corrected to 10 fps: do not slow them again. Preserve screen-recording timing separately.

Use H.264 video with `yuv420p` pixels and MP4 fast-start metadata for browser playback. Keep each file below GitHub's 100 MB per-file limit. Do not crop the five-camera grids or comparison panels to fit a different aspect ratio.

## Deployment

The site is served from the root of the `main` branch. Push updates to that branch to publish them without changing the URL.