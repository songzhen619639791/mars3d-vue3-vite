<template>
	<mars-map :url="configUrl" map-key="sxh" @onload="marsOnload"/>
	<template v-if="mapLoaded">
		<!--<layer-manage :mapInstance="mapInstance"/>-->
		<!--<mars-widget :widget="comp" ：mapInstance="mapInstance"/>-->
	</template>
</template>
<script setup lang="ts">
    import {reactive} from "vue"
    import * as mars3d from "mars3d";
    import MarsMap from "@mars/components/mars-work/mars-map.vue";
    import MarsWidget from "@mars/widgets/widget.vue"
    import LayerManage from "@mars/components/sxh-work/layer-manage/index.vue"
    import {defineAsyncComponent, markRaw, ref} from "vue";

    const configUrl = "config/config.json";
    const Cesium = mars3d.Cesium;
    const mapLoaded = ref(false) // map加载完成
    const comp = {
        component: markRaw(defineAsyncComponent(() => import("@mars/components/sxh-work/layer-manage/index.vue"))),
        name: "layer-manage"
    }
    let mapInstance: mars3d.Map
    const marsOnload = (map: any) => {
        mapInstance = reactive(map)
        mapLoaded.value = true
        const graphicLayer = new mars3d.layer.GraphicLayer();
        map.addLayer(graphicLayer);

        // 2.在layer上绑定监听事件
        graphicLayer.on(mars3d.EventType.click, function (event: any) {
            console.log("监听layer，单击了矢量对象", event);
        });
        graphicLayer.on(mars3d.EventType.mouseOver, function (event: any) {
            console.log("监听layer，鼠标移入了矢量对象", event);
        });
        graphicLayer.on(mars3d.EventType.mouseOut, function (event: any) {
            console.log("监听layer，鼠标移出了矢量对象", event);
        });
        // 可在图层绑定右键菜单,对所有加到这个图层的矢量数据都生效
        graphicLayer.bindContextMenu([
            {
                text: "删除对象",
                icon: "fa fa-trash-o",
                callback: function (e: any) {
                    const graphic = e.graphic;
                    if (graphic) {
                        graphicLayer.removeGraphic(graphic);
                    }
                },
            },
        ]);

        let graphicLayer2:mars3d.layer.GeoJsonLayer
        showSxh()
        function showSxh() {
            if (graphicLayer2) {
                graphicLayer2.clear()
                map.removeLayer(graphicLayer2, true)
                graphicLayer2 = null
            }
            graphicLayer2 = new mars3d.layer.GeoJsonLayer({
                name: "烧香河",
                url: "data/sxh.json",
                format: simplifyGeoJSON, // 用于自定义处理geojson
                symbol: {
                    type: "polylineP",
                    styleOptions: {
                        width: 2,
                        materialType: mars3d.MaterialType.LineFlow,
                        materialOptions: {
                            color: "#00ffff",
                            image: "img/textures/fence-line.png",
                            speed: 20,
                            repeat_x: 40
                        },
                    }
                },
                flyTo: true
            })
            map.addLayer(graphicLayer2)
            /*graphicLayer2.startDraw({
                type: "dynamicRiver",
                style: {
                    image: "./img/textures/poly-rivers.png",
                    width: 280,
                    height: 30,
                    speed: 10
                }
            })*/

           /* mars3d.Util.fetchJson({url: "data/sxh.json",}).then((data: any) => {
                console.log(data.features[0].geometry.coordinates[]);
                let graphic:mars3d.graphic.BaseGraphic
                graphicLayer.addGraphic(graphic)
            })*/
            // 绑定事件
            graphicLayer2.on(mars3d.EventType.load, function (event) {
                console.log("数据加载完成", event)
            })
        }

        // 简化geojson的坐标
        function simplifyGeoJSON(geojson) {
            try {
                geojson = turf.simplify(geojson, {tolerance: 0.0001, highQuality: true, mutate: true})
            } catch (e) {
                //
            }
            return geojson
        }
    };
</script>
<style></style>
