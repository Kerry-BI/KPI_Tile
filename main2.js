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
   <div <h2 class="column" id="Column1"> </h2></div>
   <div id="Column2"> 
   <p1 id="Tilevalue" style="padding: 0px 15px 8px 8px">measure Name</p1>
   <p1 id="TileHeading" style="padding: 0px 15px 8px 8px"><b>measure value</b></p1>
   </div> 
    <div id="Column3" style="padding: 0px 0px 0px 0px"> 
   </div> 
    
   
	</div>

	<style>

	p {
		line-height: normal;
		display: inline-block;
		vertical-align: middle;
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
		align-items: center;
        float: left;
		text-align: center;
        width: 50%;
        height: 100%;
        border-color: black;
        background-color: white !important;
        
    }
     #Column3 {
        float: right;
        width: 47%;
        height: 100%;
        border-color: black;
        background-color: white !important;
        
    }
	</style>
	
	`;

	var scaleval= "000";
	var decimal = 0;
	var fontValue=15;

	class KPItile extends HTMLElement {


		constructor() {
			super(); 
			this._shadowRoot = this.attachShadow({mode: 'open'});
			this._shadowRoot.appendChild(template.content.cloneNode(true));
			console.log("example");
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
			console.log("example render");
			this.render();
			}

			set myDataSource (dataBinding) {
				console.log("example data render");
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
				//this.style["scaling"] = changedProperties["scaling"];
				this._updateValueFontSize(changedProperties.ValueFontSize);
				
			}

			if ("decimals" in changedProperties) {
				console.log(changedProperties.decimals)
				this._updateDecimals(changedProperties.decimals);
			}

			
			if ("myDataSource" in changedProperties) {
					this._updateData(changedProperties.myDataSource);
			}
			
			}

			_updateScaling(scale) {
				console.log(scale);
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
				console.log(scale);
			}

			_updateDecimals(decimalnum) {
				console.log("decimalnum;");
				console.log(decimalnum);
				decimal = decimalnum
				this.render();
			}

			_updateValueFontSize(ValueFontSize) {
				console.log("ValueFontSize;");
				console.log(ValueFontSize);
				fontValue = ValueFontSize
				this.render();
			}

			onCustomWidgetResize (width, height) {
				this.render()
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
			await getScriptPromisify(
				'https://cdn.staticfile.org/echarts/5.0.0/echarts.min.js'
			  );
			console.log("l1");
			this.dispose();
			console.log("l2");
			//console.log(this._myDataSource.state);
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

			  var total=0;
			for(var i=0; i<transformedData.length; i++){
				total = total+transformedData[i].measure
			}
			console.log(total);
			  console.log("l7");
			  console.log((transformedData[0].measure));
			  console.log("l8");
			//console.log(this._shadowRoot.getElementsByClassName("head1")[0].innerHTML = "Goodbye");
			  console.log("l9");
			  const sign = Math.sign(Number(total));
			  console.log("scle _ val" );
			  console.log(scaleval );
				if(scaleval="Whole"){
						this._root.innerHTML = "<b>"+Number(Math.round(total+'e'+decimal)+'e-'+decimal)+"</b>";
						
				}else if(scaleval="M"){
						this._root.innerHTML = "<b>"+Number(Math.round(sign * (Math.abs(Number(total)) / 1.0e6)+'e'+decimal)+'e-'+decimal) + "M"+"</b>"
						
				}else if(scaleval="000"){
						this._root.innerHTML = "<b>"+sign * (Math.abs(Number(total)) / 1.0e3) + "K"+"</b>";
						
				}

				
				this._root.style.fontSize = fontValue+"px";
			 //this._root.innerHTML = "<b>"+total+"</b>";
			  this._root2.textContent = metadata.mainStructureMembers.measures_0.label;
			  //this._root = transformedData[0].measure;
			  console.log(metadata.mainStructureMembers.measures_0.label);
			  
	  
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
			  
			  console.log("l10");
			  console.log(series);
			  console.log("l11");
			  console.log(categoryData);

			  const myChart = echarts.init(this._root3)
      const option = {
		responsive: true,
		maintainAspectRatio: false,
        xAxis: {
          type: 'category',
          data: categoryData,
		  show: false,
		  boundaryGap: false
        },
        yAxis: {
          type: 'value',
		  show: false
        },
        tooltip: {
          trigger: 'axis'
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
            smooth: true

			
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