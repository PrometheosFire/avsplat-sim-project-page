const selector = document.querySelector(".scene-selector");
const sceneVideo = document.querySelector("#scene-video");
const sceneSource = document.querySelector("#scene-source");
const sceneName = document.querySelector("#scene-name");
const sceneDownload = document.querySelector("#scene-download");
const sceneError = document.querySelector("#scene-error");
const sceneErrorLink = document.querySelector("#scene-error-link");

function showSceneError() {
  sceneError.hidden = false;
}

sceneVideo.addEventListener("error", showSceneError);
sceneSource.addEventListener("error", showSceneError);

selector.addEventListener("click", async (event) => {
  const button = event.target.closest("button[data-scene-src]");
  if (!button || !selector.contains(button) || button.getAttribute("aria-pressed") === "true") {
    return;
  }

  const resumePlayback = !sceneVideo.paused;
  const label = button.textContent.trim();
  sceneVideo.pause();
  sceneError.hidden = true;
  sceneSource.src = button.dataset.sceneSrc;
  sceneVideo.poster = button.dataset.scenePoster;
  sceneVideo.setAttribute("aria-label", `${label}: five-camera reconstruction`);
  sceneName.textContent = label;
  sceneDownload.href = button.dataset.sceneSrc;
  sceneErrorLink.href = button.dataset.sceneSrc;

  for (const option of selector.querySelectorAll("button[data-scene-src]")) {
    option.setAttribute("aria-pressed", String(option === button));
  }

  sceneVideo.load();
  if (resumePlayback) {
    try {
      await sceneVideo.play();
    } catch (error) {
      if (error.name !== "AbortError" && error.name !== "NotAllowedError") {
        showSceneError();
      }
    }
  }
});