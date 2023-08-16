var getScriptPromisify = (src) => {
	return new Promise((resolve) => {
	  $.getScript(src, resolve)
	})
  }

const parseMetadata = metadata => {
    const { dimensions: dimensionsMap, mainStructureMembers: measuresMap } = metadata
    const dimensions = []
    for (const key in dimensionsMap) {
      const dimension = dimensionsMap[key]
      dimensions.push({ key, ...dimension })
    }
    const measures = []
    for (const key in measuresMap) {
      const measure = measuresMap[key]
      measures.push({ key, ...measure })
    }
    return { dimensions, measures, dimensionsMap, measuresMap }
  }


(function() { 
	const template = document.createElement('template')
	template.innerHTML = `
	<div class="row" id="Tile" style="width: 99%; height: 95%;">
    <div <h2 class="column" id="Column1"></h2>
    </div>
    <div id="Column2">
        <div class="inner-content">
            <div id="Tilevalue">measure Name</div>
            <div id="TileHeading"><b>measure value</b></div>
        </div>
    </div>
    <div id="Column3" style="padding: 0px 0px 0px 0px">
    </div>


</div>

<style>

.inner-content {
    text-align: center; /* Horizontally centers content */
  }
    #TileValue {
        float: right;
		text-align: center;
        width: 100%;
        height: 10%;
        display: flex;

    }

    #TileHeading {
        float: right;
		text-align: center;
        clear: left;
        width: 100%;
        display: flex;
    }




    #Tile {
        border-style: solid;
        border-radius: 3px;
        border: 1px solid black;
    }

    #Column1 {
        float: left;
        top: 0px;
        width: 3%;
        height: 100%;
        border-color: black;
        border-top-left-radius: 1px;
        border-bottom-left-radius: 1px;
        background-color: #005776;
    }

    #Column2 {
        display: flex;
        align-items: center; /* Vertically centers items */
        justify-content: center; /* Horizontally centers items */
        float: left;
        width: 50%;
        height: 100%;
        border-color: black;
        background-color: white;
    }

    #Column3 {
		display: flex;
        align-items: center; /* Vertically centers items */
        justify-content: center; /* Horizontally centers items */
        float: right;
        width: 47%;
        height: 100%;
        border-color: black;
        background-color: white;

    }
		</style>
	`;

	var scaleval= "000";
	var decimal = 0;
	var fontValue=15;
	var labelValue=15;
	var lineIsCurved = true;
	var xAxisValue = false;
	var yAxisValue = false;


	class KPItile extends HTMLElement {


		constructor() {
			super(); 
			this._shadowRoot = this.attachShadow({mode: 'open'});
			this._shadowRoot.appendChild(template.content.cloneNode(true));
	
			this._root3 = this._shadowRoot.getElementById('Column3');
			this._root2 = this._shadowRoot.getElementById('Tilevalue');
			this._root = this._shadowRoot.getElementById('TileHeading');
			this._col2style = this._shadowRoot.getElementById('Column2');
			this._col3style = this._shadowRoot.getElementById('Column3');
			

			this.addEventListener("click", event => {
				var event = new Event("onClick");
				this.dispatchEvent(event);
			});
			this._props = {};
			this.render();
			}

			set myDataSource (dataBinding) {
				this._myDataSource = dataBinding
			
				this.render(scaleval)
		  	}

			onCustomWidgetBeforeUpdate(changedProperties) {
			this._props = { ...this._props, ...changedProperties };
			}

			onCustomWidgetAfterUpdate(changedProperties) {
			if ("color" in changedProperties) {
				this._col2style.style["background-color"] = changedProperties["color"];
				this._col3style.style["background-color"] = changedProperties["color"];
			}
			if ("scaling" in changedProperties) {
				//this.style["scaling"] = changedProperties["scaling"];
				this._updateScaling(changedProperties.scaling);
			}

			if ("ValueFontSize" in changedProperties) {
				this._updateValueFontSize(changedProperties.ValueFontSize);
			}

			if ("LabelFontSize" in changedProperties) {
				this._updateLabelFontSize(changedProperties.LabelFontSize);
			}

			if ("decimals" in changedProperties) {
				this._updateDecimals(changedProperties.decimals);
			}

			if ("showxAxis" in changedProperties) {
				if(changedProperties["showxAxis"]==="true"){
					xAxisValue = true;
				}else if(changedProperties["showxAxis"]==="false"){
					xAxisValue = false;
				}
			}

			if ("showyAxis" in changedProperties) {
				if(changedProperties["showyAxis"]==="true"){
					yAxisValue = true;
				}else if(changedProperties["showyAxis"]==="false"){
					yAxisValue = false;
				}
			}

			if ("lineOption" in changedProperties) {
				if(changedProperties["lineOption"]==="Curve"){
					lineIsCurved = true;
				}else if(changedProperties["lineOption"]==="Line"){
					lineIsCurved = false;
				}
				this.render();
			}

			
			if ("myDataSource" in changedProperties) {
					this._updateData(changedProperties.myDataSource);
			}
			
			}

			_updateScaling(scale) {
				scaleval = scale
				this.render();
				// const sign = Math.sign(Number(transformedData[0].measure));
				// switch(scale){
				// 	case "Whole":
				// 		this._root.textContent = transformedData[0].measure;
				// 		break;
				// 	case "M":
				// 		this._root.textContent = sign * (Math.abs(Number(transformedData[0].measure)) / 1.0e6) + "M"
				// 		break;
				// 	case "000":
				// 		this._root.textContent = sign * (Math.abs(Number(transformedData[0].measure)) / 1.0e3) + "K"
				// 		break;

				// }
			}

			_updateDecimals(decimalnum) {
				decimal = decimalnum
				this.render();
			}

			_updateValueFontSize(ValueFontSize) {
				fontValue = ValueFontSize
				this.render();
			}

			_updateLabelFontSize(LabelFontSize) {
				labelValue = LabelFontSize
				this.render();
			}

			onCustomWidgetResize (width, height) {
				this.render()
			  }
			
			_updateData(dataBinding) {
				if (!dataBinding) {
					console.error('dataBinding is undefined');
				}
				if (!dataBinding || !dataBinding.data) {
					console.error('dataBinding.data is undefined');
				}
				
				if (this._ready) {
					// Check if dataBinding and dataBinding.data are defined
					if (dataBinding && Array.isArray(dataBinding.data)) {
						// Transform the data into the correct format
						const transformedData = dataBinding.data.map(row => {
							// Check if dimensions_0 and measures_0 are defined before trying to access their properties
							if (row.dimensions_0 && row.measures_0) {
								return {
									dimension: row.dimensions_0.label,
									measure: row.measures_0.raw
								};
							}
						}).filter(Boolean);  // Filter out any undefined values
			
						this._renderChart(transformedData);
					} else {
						console.error('Data is not an array:', dataBinding && dataBinding.data);
					}
				}
			}


			async render () {

			await getScriptPromisify(
				'https://cdn.staticfile.org/echarts/5.0.0/echarts.min.js'
			  );

			this.dispose();

			if (!this._myDataSource || this._myDataSource.state !== 'success') {
			  return
			}
			const { data, metadata } = this._myDataSource

			const { dimensions, measures } = parseMetadata(metadata)
			


			const transformedData = this._myDataSource.data.map(row => {
				// Check if dimensions_0 and measures_0 are defined before trying to access their properties
				if (row.dimensions_0 && row.measures_0) {
					return {
						dimension: row.dimensions_0.label,
						measure: row.measures_0.raw
					};
				}else if(row.measures_0){
					return {
						measure: row.measures_0.raw
					};
				}
			})


			  var total=0;
			for(var i=0; i<transformedData.length; i++){
				total = total+transformedData[i].measure
			}

			  const sign = Math.sign(Number(total));
				if(scaleval="Whole"){
						this._root.innerHTML = "<b>"+(Number(Math.round(total+'e'+decimal)+'e-'+decimal)).toLocaleString("en-US")+"</b>";
						
				}else if(scaleval="M"){
						this._root.innerHTML = "<b>"+(Number(Math.round(sign * (Math.abs(Number(total)) / 1.0e6)+'e'+decimal)+'e-'+decimal)).toLocaleString("en-US") + "M"+"</b>"
						
				}else if(scaleval="000"){
						this._root.innerHTML = "<b>"+(sign * (Math.abs(Number(total)) / 1.0e3)).toLocaleString("en-US") + "K"+"</b>";
						
				}

				
				this._root.style.fontSize = fontValue+"px";
				this._root2.style.fontSize = labelValue+"px";
			 
			  this._root2.textContent = metadata.mainStructureMembers.measures_0.label;
			  //this._root = transformedData[0].measure;
			  
	  
			// dimension
			const categoryData = []

			// measures
			const series = measures.map(measure => {
			  return {
				data: [],
				key: measure.key,
				type: 'line',
				smooth: true
			  }
			})


			
			

			data.forEach(row => {
				// dimension
				categoryData.push(dimensions.map(dimension => {
				  return row[dimension.key].label
				}).join('/'))
				// measures
				series.forEach(series => {
				  series.data.push(row[series.key].raw)
				})
			  })
			  

			  const myChart = echarts.init(this._root3)
      	const option = {
		responsive: true,
		maintainAspectRatio: false,
        xAxis: {
          type: 'category',
          data: categoryData,
		  show: xAxisValue,
		  boundaryGap: false,
		  scale: true
        },
        yAxis: {
          type: 'value',
		  show: yAxisValue,
		  scale: true
        },
        tooltip: {
		  showConent: false,
          trigger: 'axis',
		  formatter: function (params) {
			console.log("value on hover of chart");
			console.log(params[0].value);
			console.log(params[0].name);
			
			// return `
			// 	   </br>
			// 		${params[0].value} : ${params[0].data.name} <br />`
					
	  		}
        },
        series: [
          {
            lineStyle: {
			color: '#005776',
            width: 2
            },
			data: series[0].data,
            type: 'line',
			color: {
				type: 'linear',
				x: 0,
				y: 0,
				x2: 0,
				y2: 1,
				colorStops: [{
				  offset: 0, color: '#3d88ff' // color at 0%
				}, {
				  offset: 1, color: 'white' // color at 100%
				}],
				global: false // default is false
			  },
            symbolSize:1,
			areaStyle: {},
			showSymbol: false,
            smooth: lineIsCurved,
			animation: false

			
          }
        ]
      }
      myChart.setOption(option)


		  }
	  
		  dispose () {
			if (this._echart) {
			  echarts.dispose(this._echart)
			}
		  }
		}
	  
		customElements.define('com-sap-sample-kpi-tile', KPItile)
	  })()