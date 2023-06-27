(function() { 
	let template = document.createElement("template");
	template.innerHTML = `
	<div id="PrimaryValueBox" style="width: 100%; height: 100%;">
		<h2 id="PrimaryValueTitle">This is heading 2</h2>
		<h2 id="PrimaryValue">This is heading 2</h2>
    </div>
		<style>
		{
			border-radius: 5px;
			border-width: 2px;
			border-color: black;
			border-style: solid;
			display: block;
		} 
		</style> 
	
	`;

	class KPItile extends HTMLElement {
		constructor() {
			super(); 
			let shadowRoot = this.attachShadow({mode: "open"});
			shadowRoot.appendChild(template.content.cloneNode(true));
			this.addEventListener("click", event => {
				var event = new Event("onClick");
				this.dispatchEvent(event);
			});
			this._props = {};
		}

		onCustomWidgetBeforeUpdate(changedProperties) {
			this._props = { ...this._props, ...changedProperties };
		}

		onCustomWidgetAfterUpdate(changedProperties) {
			if ("color" in changedProperties) {
				this.style["background-color"] = changedProperties["color"];
			}
			if ("opacity" in changedProperties) {
				this.style["opacity"] = changedProperties["opacity"];
			}
		}
	}

	customElements.define("com-sap-sample-kpi-tile", KPItile);
})();