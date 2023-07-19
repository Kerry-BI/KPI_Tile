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
	<div class="row" id="Tile" style="width: 200px; height: 70px;">
   <div <h2 class="column" id="Column1"> </h2></div>
   <div id="Column2"> 
   <p1 id="Tilevalue" style="padding: 0px 15px 8px 8px">measure Name</p1>
   <p1 id="TileHeading" style="padding: 0px 15px 8px 8px">measure value</p1>
   </div> 
    <div id="Column3"> 
   </div> 
    
   
	</div>

	<style>
    #Tile {
        border-style: solid;
        border-radius: 5px;
        border: 2px solid black;
    }

    #Column1 {
        float: left;
        top: 0px;
        width: 3%;
        height: 100%;
        border-color: black;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
        background-color: blue;
    }

    #Column2 {
        float: left;
        width: 50%;
        height: 100%;
        border-color: black;
        background-color: red;
        
    }
     #Column3 {
        float: right;
        width: 47%;
        height: 100%;
        border-color: black;
        background-color: yellow;
        
    }
	</style>
	
	`;

	class KPItile extends HTMLElement {
		constructor() {
			super(); 
			this._shadowRoot = this.attachShadow({mode: 'open'});
			this._shadowRoot.appendChild(template.content.cloneNode(true));
			console.log("example");
			this._root = this._shadowRoot.getElementById('TileHeading');

			this.addEventListener("click", event => {
				var event = new Event("onClick");
				this.dispatchEvent(event);
			});
			this._props = {};
			console.log("example render");
			this.render()
			}

			set myDataSource (dataBinding) {
				console.log("example data render");
				this._myDataSource = dataBinding
			
				this.render()
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
			
			if ("myDataSource" in changedProperties) {
					this._updateData(changedProperties.myDataSource);
			}
			
			}

			_updateData(dataBinding) {
				console.log('dataBinding:', dataBinding);
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
							console.log('row:', row);
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
			console.log("example start render");
			await getScriptPromisify("https://cdn.staticfile.org/echarts/5.3.0/echarts.min.js");
			console.log("l1");
			this.dispose()
			console.log("l2");
			console.log(this._myDataSource.state);
			console.log(this._myDataSource);
			if (!this._myDataSource || this._myDataSource.state !== 'success') {
			  return
			}
			console.log("l3");
			const { data, metadata } = this._myDataSource
			console.log("l4");
			const { dimensions, measures } = parseMetadata(metadata)
			
			console.log("l5");
			console.log(this._myDataSource.data);
			console.log(this._myDataSource.data[0]);
			// console.log(this._myDataSource.data[0].find('measures_0'));
			// console.log(this._myDataSource.data[0].find('measures_0').raw);
			// console.log(measures[0].label);
			// console.log(measures[0].key);

			const transformedData = this._myDataSource.data.map(row => {
				console.log('row:', row);
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
			  console.log("l6");
			  console.log(transformedData);
			  console.log("l7");
			  console.log((transformedData[0].measure));
			  console.log("l8");
			 // console.log(this._shadowRoot.getElementsByClassName("head1")[0].innerHTML = "Goodbye");
			  console.log("l9");
			  this._root.textContent = transformedData[0].measure;
			  //this._root = transformedData[0].measure;
			  console.log(metadata);
			  console.log(mainStructureMembers);


			//this._echart = echarts.init(this._root, 'wight')
	  
			// const option = {
			//   series: [
			// 	{
			// 	  type: 'gauge',
			// 	  data: measures.map((measure, i) => {
			// 		return {
			// 		  value: data[0][measure.key].raw,
			// 		  //name: measure.label,
			// 		  // title: {
			// 		  //   offsetCenter: ['-0%', `${-35 + i * 30}%`]
			// 		  // },
			// 		  detail: {
			// 			valueAnimation: true,
			// 			offsetCenter: ['0%', `0%`]
			// 		  }
			// 		}
			// 	  }),
			// 	  startAngle: 90,
			// 	  endAngle: -270,
			// 	  pointer: {
			// 		show: false
			// 	  },
			// 	  progress: {
			// 		show: true,
			// 		overlap: false,
			// 		roundCap: false,
			// 		clip: false,
			// 		itemStyle: {
			// 		  borderWidth: 1,
			// 		  color:'#348B26',
			// 		  borderColor: '#348B26'
			// 		}
			// 	  },
			// 	  axisLine: {
			// 		lineStyle: {
			// 		  width:25
			// 		}
			// 	  },
			// 	  splitLine: {
			// 		show: false,
			// 		distance: 0,
			// 		length: 10
			// 	  },
			// 	  axisTick: {
			// 		show: false
			// 	  },
			// 	  axisLabel: {
			// 		show: false,
			// 		distance: 50
			// 	  },
			// 	  title: {
			// 		fontSize: 14
			// 	  },
			// 	  detail: {
			// 		width: 50,
			// 		height: 14,
			// 		fontSize: 36,
			// 		color:'#999999',
			// 		formatter: '{value}%'
			// 	  }
			// 	}
			//   ]
			// }
			//this._echart.setOption(option)
		  }
	  
		  dispose () {
			if (this._echart) {
			  echarts.dispose(this._echart)
			}
		  }
		}
	  
		customElements.define('com-sap-sample-kpi-tile', KPItile)
	  })()