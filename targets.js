function renderButtons(targets) {
  buttonsContainer.innerHTML = "";
  targets.slice(0, 10).forEach(target => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("target-entry");

    // Add class for tag styling
    if (target.tag.toLowerCase().includes("impersonator")) {
      wrapper.classList.add("impersonator");
    }
    if (target.tag.toLowerCase().includes("cheat")) {
      wrapper.classList.add("cheat");
    }

    const nameBtn = document.createElement("button");
    nameBtn.textContent = target.name;
    nameBtn.classList.add("target-button");
    nameBtn.addEventListener("click", () => {
      clickSound.play();
      selectedLink = target.externalLink;
      showReport(target.reportText);
    });

    const tag = document.createElement("span");
    tag.textContent = target.tag;
    tag.classList.add("target-tag");

    // Color is now optional, as styling will come from CSS via wrapper class
    // But if you still want inline color:
    if (target.tag.toLowerCase() === "impersonator") tag.style.color = "#17c9e2";
    if (target.tag.toLowerCase() === "cheat promoter") tag.style.color = "#bd51ea";

    wrapper.appendChild(nameBtn);
    wrapper.appendChild(tag);
    buttonsContainer.appendChild(wrapper);
  });
}
