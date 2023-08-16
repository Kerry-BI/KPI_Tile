(function()  {
	let template = document.createElement("template");
	template.innerHTML = `
		<form id="form_color">
			<fieldset>
			<legend>KPI Tile Properties</legend>
				<table>
					<tr>
						<td>Color</td>
						<td><input id="styling_color" type="text" size="40" maxlength="40"></td>
					</tr>
				</table>
				<input type="submit" style="display:none;">
		</fieldset>
		</form>
		<form id="form_scale">
		<fieldset>
		<legend>KPI Tile Properties</legend>
		<label for="membership">Scaling Value:</label>
			<select name="scale_value" id="scale_value">
  				<option value="000" selected>000's</option>
  				<option value="Whole">Whole</option>
  				<option value="M" >M's</option>
			</select>
		</fieldset>
		</form>
		<form id="form_value_text_size">
		<fieldset>
		<legend>KPI Tile Properties</legend>
		<table>
					<tr>
						<td> ValueText Size</td>
						<td><input id="text_size" type="number" size="40" maxlength="40"></td>
					</tr>
				</table>
				<input type="submit" style="display:none;">
		</fieldset>
		</form>
		<form id="form_label_text_size">
		<fieldset>
		<legend>KPI Tile Properties</legend>
		<table>
					<tr>
						<td> Label Text Size</td>
						<td><input id="label_size" type="number" size="40" maxlength="40"></td>
					</tr>
				</table>
				<input type="submit" style="display:none;">
		</fieldset>
		</form>
		<form id="form_decimal_place">
		<fieldset>
		<legend>KPI Tile Properties</legend>
		<table>
					<tr>
						<td>decimal places</td>
						<td><input id="decimal_place" type="number" size="40" maxlength="40"></td>
					</tr>
				</table>
				<input type="submit" style="display:none;">
		</fieldset>
		</form>
		<form id="form_line_option">
		<fieldset>
		<legend>KPI Tile Properties</legend>
		<label for="line_option">Chart Line Option:</label>
			<select name="line_option" id="line_option">
  				<option value="Curve" selected>Curve</option>
  				<option value="Line">Line</option>
			</select>
		</fieldset>
		</form>
		<form id="form_xAxis_option">
		<fieldset>
		<legend>KPI Tile Properties</legend>
		<label for="xAxis_option">Show x axis on chart:</label>
			<select name="xAxis_option" id="xAxis_option">
  				<option value="false" selected>false</option>
  				<option value="true">true</option>
			</select>
		</fieldset>
		</form>
		<form id="form_yAxis_option">
		<fieldset>
		<legend>KPI Tile Properties</legend>
		<label for="yAxis_option">Show y axis on chart:</label>
			<select name="yAxis_option" id="yAxis_option">
				<option value="false" selected>false</option>
				<option value="true">true</option>
			</select>
		</fieldset>
		</form>
	`;

	class KPIStylePanel extends HTMLElement {
		constructor() {
			super();
			this._shadowRoot = this.attachShadow({mode: "open"});
			this._shadowRoot.appendChild(template.content.cloneNode(true));
			this._shadowRoot.getElementById("form_color").addEventListener("submit", this._submitcolor.bind(this));
			this._shadowRoot.getElementById("form_decimal_place").addEventListener("submit", this._submitdecimalplace.bind(this));
			this._shadowRoot.getElementById("form_value_text_size").addEventListener("submit", this._submittextvaluesize.bind(this));
			this._shadowRoot.getElementById("form_label_text_size").addEventListener("submit", this._submitlabelvaluesize.bind(this));
			this._shadowRoot.getElementById("scale_value").addEventListener("click",this._shadowRoot.getElementById("scale_value").addEventListener("change", this._submitscale.bind(this)));
			this._shadowRoot.getElementById("form_line_option").addEventListener("click",this._shadowRoot.getElementById("line_option").addEventListener("change", this._submitlineoption.bind(this)));
			this._shadowRoot.getElementById("form_xAxis_option").addEventListener("click",this._shadowRoot.getElementById("xAxis_option").addEventListener("change", this._submitxAxisoption.bind(this)));
			this._shadowRoot.getElementById("form_yAxis_option").addEventListener("click",this._shadowRoot.getElementById("yAxis_option").addEventListener("change", this._submityAxisoption.bind(this)));
		}

		_submitcolor(e) {
			e.preventDefault();
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
					detail: {
						properties: {
							color: this.color
						}
					}
			}));
		}

		_submitdecimalplace(e) {
			console.log(e);
			e.preventDefault();
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
					detail: {
						properties: {
							decimals: this.decimals
						}
					}
			}));
		}

		_submittextvaluesize(e) {
			console.log(e);
			e.preventDefault();
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
					detail: {
						properties: {
							ValueFontSize: this.ValueFontSize
						}
					}
			}));
		}

		_submitlabelvaluesize(e) {
			console.log(e);
			e.preventDefault();
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
					detail: {
						properties: {
							LabelFontSize: this.LabelFontSize
						}
					}
			}));
		}

		_submitscale(e) {
			console.log(e);
			e.preventDefault();
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
					detail: {
						properties: {
							scaling: this.scaling
						}
					}
			}));
		}

		_submitlineoption(e) {
			console.log(e);
			e.preventDefault();
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
					detail: {
						properties: {
							lineOption: this.lineOption
						}
					}
			}));
		}

		_submitxAxisoption(e) {
			console.log(e);
			e.preventDefault();
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
					detail: {
						properties: {
							showxAxis: this.showxAxis
						}
					}
			}));
		}

		_submityAxisoption(e) {
			console.log(e);
			e.preventDefault();
			this.dispatchEvent(new CustomEvent("propertiesChanged", {
					detail: {
						properties: {
							showyAxis: this.showyAxis
						}
					}
			}));
		}



		set color(newColor) {
			this._shadowRoot.getElementById("styling_color").value = newColor;
		}

		get color() {
			return this._shadowRoot.getElementById("styling_color").value;
		}

		set scaling(newScaling) {
			this._shadowRoot.getElementById("scale_value").value = newScaling;
		}

		get scaling() {
			return this._shadowRoot.getElementById("scale_value").value;
		}

		set lineOption(newlineOption) {
			this._shadowRoot.getElementById("line_option").value = newlineOption;
		}

		get lineOption() {
			return this._shadowRoot.getElementById("line_option").value;
		}

		set showxAxis(newxAxisOption) {
			this._shadowRoot.getElementById("xAxis_option").value = newxAxisOption;
		}

		get showxAxis() {
			return this._shadowRoot.getElementById("xAxis_option").value;
		}

		set showyAxis(newyAxisOption) {
			this._shadowRoot.getElementById("yAxis_option").value = newyAxisOption;
		}

		get showyAxis() {
			return this._shadowRoot.getElementById("yAxis_option").value;
		}

		set decimals(newDecimal) {
			this._shadowRoot.getElementById("decimal_place").value = newDecimal;
		}

		get decimals() {
			return this._shadowRoot.getElementById("decimal_place").value;
		}

		set ValueFontSize(newValueFontSize) {
			this._shadowRoot.getElementById("text_size").value = newValueFontSize;
		}

		get ValueFontSize() {
			return this._shadowRoot.getElementById("text_size").value;
		}

		set LabelFontSize(newLabelFontSize) {
			this._shadowRoot.getElementById("text_size").value = newLabelFontSize;
		}

		get LabelFontSize() {
			return this._shadowRoot.getElementById("text_size").value;
		}

	}

customElements.define("com-sap-sample-kpi-tile-style", KPIStylePanel);
})();