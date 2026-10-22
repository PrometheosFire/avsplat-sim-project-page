{
  const diagram = document.querySelector("#loop-diagram");
  const schedules = JSON.parse(diagram.querySelector("#round-data").textContent);
  const tabs = [...diagram.querySelectorAll("[data-round]")];
  const formatOffsets = offsets => offsets.map(offset => `${offset} m`).join(", ");
  const titles = ["Start close to the recording.", "Keep the first views. Reach farther.", "Generate supervision at the target.", "Train the final model with the full bank."];
  const summaries = {
    cumulative: [
      "Train on the real frames, then clean selected renders at -1 m using a real frame from the same camera and instant as reference.",
      "Train a fresh model with the first bank entries. Clean fresh selected views at -1 and -2 m, while retaining the earlier -1 m views.",
      "Train with both earlier batches. Clean fresh selected views across -1, -2, and -3 m; earlier entries remain and target views enter the bank for the final round.",
      "Train from scratch on real frames and all three pseudo-view batches, then render the shifted trajectories. No further cleaning or bank append is performed."
    ],
    incremental: [
      "Train on the real frames, then clean selected renders at -1 m using a real frame from the same camera and instant as reference.",
      "Train a fresh model with the banked -1 m views. Clean only the new -2 m offset; keep the earlier -1 m views without cleaning that offset again.",
      "Train with banked views at -1 and -2 m. Clean only the new -3 m offset, then add its views to the bank for the final round.",
      "Train from scratch on real frames and all three pseudo-view batches, then render the shifted trajectories. No further cleaning or bank append is performed."
    ]
  };
  let currentMode = diagram.querySelector('input[name="schedule-mode"]:checked').value;
  let currentRound = 0;

  function selectRound(index) {
    currentRound = index;
    const schedule = schedules[currentMode];
    const finalRound = index === schedule.length;
    const state = { clean: finalRound ? [] : schedule[index], bank: schedule.slice(0, index) };
    const bankedOffsets = new Set(state.bank.flat().map(Math.abs));
    const cleanedOffsets = new Set(state.clean.map(Math.abs));
    for (const tab of tabs) {
      const selected = Number(tab.dataset.round) === index;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    }
    diagram.querySelector("#round-panel").setAttribute("aria-labelledby", `round-${index}`);
    diagram.querySelector("#model-label").textContent = `Model ${index} / ${index ? "real frames + accumulated bank" : "real frames only"}`;
    diagram.querySelector("#round-title").textContent = titles[index];
    diagram.querySelector("#round-summary").textContent = summaries[currentMode][index];
    diagram.querySelector("#mode-note").textContent = currentMode === "cumulative" ? "Clean every reached offset with the current model. Earlier bank entries remain." : "Clean only the newest offset. Earlier offsets stay in the bank without being cleaned again.";
    diagram.querySelector("#study-note").textContent = `Example: a one-sided ${currentMode} curriculum, with a 1 m step and a -3 m target. ${currentMode === "cumulative" ? "Earlier offsets are cleaned again at different selected timestamps; all earlier entries remain." : "Only the next offset is cleaned each round; all earlier entries remain."} Completing the target schedule is not a guarantee of image quality.`;
    diagram.querySelector("#train-detail").textContent = index ? `Real frames + batches from ${index} earlier ${index === 1 ? "round" : "rounds"}.` : "Real frames only.";
    diagram.querySelector("#clean-detail").textContent = finalRound ? "No new cleaning in the final round." : `Selected views at ${formatOffsets(state.clean)}.`;
    diagram.querySelector("#append-detail").textContent = finalRound ? "The full bank is retained; nothing new is appended." : "Retain the cleaned images and their shifted poses.";
    diagram.querySelector("#bank-note").textContent = finalRound ? "All earlier entries remain, including target-offset views from round 2. Real frames still anchor training." : `Real frames remain available. This round's cleaned views are added for round ${index + 1}, without replacing earlier entries.`;
    diagram.querySelector("#return-flow").textContent = finalRound ? "Final model: target-offset supervision has entered training." : `Real frames + accumulated bank feed round ${index + 1}.`;
    for (const selector of ["#clean-step", "#bank-step"]) {
      const step = diagram.querySelector(selector);
      step.classList.toggle("inactive", finalRound);
      step.classList.toggle("active", !finalRound);
    }
    const rows = diagram.querySelector("#bank-rows");
    rows.replaceChildren();
    const batches = state.bank.length ? state.bank : [null];
    for (const [batchIndex, offsets] of batches.entries()) {
      const row = document.createElement("tr");
      if (!offsets) row.className = "empty";
      for (const text of offsets ? [`Round ${batchIndex}`, formatOffsets(offsets)] : ["No earlier round", "Empty bank"]) {
        const cell = document.createElement("td");
        cell.textContent = text;
        row.append(cell);
      }
      rows.append(row);
    }
    for (const path of diagram.querySelectorAll("[data-offset]")) {
      const offset = Number(path.dataset.offset);
      path.classList.toggle("banked", bankedOffsets.has(offset));
      path.classList.toggle("cleaning", cleanedOffsets.has(offset));
    }
    for (const overlay of diagram.querySelectorAll("[data-cleaning-offset]")) {
      const offset = Number(overlay.dataset.cleaningOffset);
      overlay.classList.toggle("visible", bankedOffsets.has(offset) && cleanedOffsets.has(offset));
    }
    for (const label of diagram.querySelectorAll("[data-offset-status]")) {
      const offset = Number(label.dataset.offsetStatus);
      const banked = bankedOffsets.has(offset);
      const cleaning = cleanedOffsets.has(offset);
      label.dataset.state = banked && cleaning ? "both" : banked ? "banked" : cleaning ? "cleaning" : "pending";
      label.textContent = banked && cleaning ? "Banked + re-clean" : banked ? "Banked earlier" : cleaning ? "New cleaning" : "Not yet banked";
    }
    for (const group of diagram.querySelectorAll("[data-pose]")) {
      const offset = Number(group.dataset.pose);
      for (const pose of group.children) {
        pose.classList.toggle("banked-pose", bankedOffsets.has(offset));
        pose.classList.toggle("active-pose", cleanedOffsets.has(offset));
      }
    }
    diagram.querySelector("#map-title").textContent = `${currentMode} shift curriculum, round ${index}`;
    diagram.querySelector("#map-description").textContent = finalRound ? "All three offset levels have entered the training bank. The final round trains and renders, without additional cleaning." : `Earlier banked offsets: ${bankedOffsets.size ? formatOffsets([...bankedOffsets].sort().map(offset => -offset)) : "none"}. Clean fresh selected views at ${formatOffsets(state.clean)}, retaining all earlier bank entries.`;
  }

  for (const input of diagram.querySelectorAll('input[name="schedule-mode"]')) {
    input.addEventListener("change", () => {
      if (!input.checked) return;
      currentMode = input.value;
      selectRound(currentRound);
    });
  }

  for (const tab of tabs) {
    tab.addEventListener("click", () => selectRound(Number(tab.dataset.round)));
    tab.addEventListener("keydown", event => {
      const current = Number(tab.dataset.round);
      const next = { ArrowRight: (current + 1) % tabs.length, ArrowLeft: (current + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1 }[event.key];
      if (next === undefined) return;
      event.preventDefault();
      selectRound(next);
      tabs[next].focus();
    });
  }
  selectRound(0);
}