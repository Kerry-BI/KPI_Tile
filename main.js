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
	let template = document.createElement("template");
	template.innerHTML = `
	<div class="row" id="Tile" style="width: 500px; height: 100px;">
   <div <h2 class="column" id="Column1"> </h2></div>
   <div id="Column2"> 
   <h2 class="column" id="TileHeading >This is measure heading</h2>
   <h2 class="column" >This is measure value</h2>
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
			let shadowRoot = this.attachShadow({mode: "open"});
			shadowRoot.appendChild(template.content.cloneNode(true));
			this.addEventListener("click", event => {
				var event = new Event("onClick");
				this.dispatchEvent(event);
			});
			this._props = {};
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
		}

		async render () {

			const resultSet = this.myDataBinding
            console.log(resultSet)
            const data1 = resultSet.data
            console.log(data1)
            const descriptionDimension = resultSet.metadata.dimensions.dimensions_0.description
            console.log(descriptionDimension)
            const lableMeasures = resultSet.metadata.mainStructureMembers.measures_0.label
            console.log(lableMeasures)
            const dataBinding2 = this.dataBindings.getDataBinding('DataBinding')
            console.log(dataBinding2)

			const dataBinding = this.dataBinding
			if (!dataBinding || dataBinding.state !== 'success') { return }
	  
			const { data, metadata } = dataBinding
			const { dimensions, measures } = parseMetadata(metadata)
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
			 ;
			})
	  
			//console.log("hello world ");
			//console.log(series);
			//console.log(measures);
			//console.log(categoryData);
			//document.getElementById("TileHeading").innerHTML = measures[0]
			//
			// const myChart = echarts.init(this._root, 'main')
			// const option = {
			//   xAxis: {
			// 	type: 'category',
			// 	data: categoryData
			//   },
			//   yAxis: {
			// 	type: 'value'
			//   },
			//   tooltip: {
			// 	trigger: 'axis'
			//   },
			//   series: [
			// 	{
			// 	  lineStyle: {
			// 	  width: 7
			// 	  },
			// 	  type: 'line',
			// 	  color: '#0FAAFF',
			// 	  symbolSize:10,
			// 	  smooth: true
			// 	}
			//   ]
			// }
			// myChart.setOption(option)
		  }
	}

	customElements.define("com-sap-sample-kpi-tile", KPItile);
})();