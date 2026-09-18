<template>
  <div class="mars-map-component">
    <!-- Mars3D 地球挂载容器 -->
    <div ref="mapDomRef" class="mars3d-container"></div>

    <!-- 行政区划下钻与搜索面板（位于地图左下角） -->
    <AreaSearch
      v-if="showAreaSearch && isMapReady"
      ref="areaSearchRef"
      :map="mapInstance"
      :custom-style="areaSearchStyle"
      @select-area="handleAreaSelect"
    />

    <!--
      地图覆盖物必须与 Cesium 画布位于同一定位容器内，避免页面级坐标换算产生偏移。
      risk-point-position 的坐标为 viewer.container 内的像素坐标。
    -->
    <slot name="overlay"></slot>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as mars3d from 'mars3d'
import * as Cesium from 'mars3d-cesium'
import CesiumNavigation from 'cesium-navigation-es6'
import AreaSearch from '@/components/AreaSearch/index.vue'
import chongqingBoundary from '@/assets/data/chongqing-boundary.json'
import yellowPoint from '@/assets/imgs/cesium/yellow-point.png'
import 'mars3d/mars3d.css'

const emit = defineEmits(['onload', 'click', 'risk-point-position', 'select-area'])

const props = defineProps({
  // 初始中心坐标，同时作为右下角重新定位的目标视角。
  defaultCenter: {
    type: Object,
    default: () => ({
      lng: 108.25109,
      lat: 29.40199,
      alt: 135257.4,
      pitch: -90,
      heading: 360,
      roll: 0,
    }),
  },
  // 自定义底图配置
  options: {
    type: Object,
    default: () => ({}),
  },
  // 是否展示行政区划搜索与下钻组件（默认在地图左下角）
  showAreaSearch: {
    type: Boolean,
    default: true,
  },
  // 行政区划组件的自定义样式（如动态调整 left 位置）
  areaSearchStyle: {
    type: Object,
    default: () => ({}),
  },
})

const mapDomRef = ref(null)
const areaSearchRef = ref(null)
const isMapReady = ref(false)

const handleAreaSelect = (data) => {
  emit('select-area', data)
}

// 避免使用 Vue 的 ref/reactive 包装 Cesium/Mars3D 实例，杜绝深层 Proxy 劫持导致的性能衰减与内存泄漏
let mapInstance = null
let resizeObserver = null
let navigationInstance = null
let chongqingBoundaryLayer = null
let earthMapLayer = null
let earthMapLabelLayer = null
let vectorMapLayer = null
let vectorMapLabelLayer = null
let cachedTerrainProvider = null
let riskPointLayer = null
let riskPointPostRenderHandler = null
let riskPointRequestId = 0

const TERRAIN_URL = 'https://application.digitalcq.com/3Dtiles/cq30m2'
const TDT_TOKEN = 'a15c655473ce0c05d18e9aba7506de12'

/**
 * 获取或创建三维切片地形 Provider
 */
const getTerrainProvider = () => {
  if (!cachedTerrainProvider) {
    cachedTerrainProvider = new Cesium.CesiumTerrainProvider({
      url: TERRAIN_URL,
    })
  }
  return cachedTerrainProvider
}

/**
 * 动态开关三维切片地形
 * @param {boolean} visible 是否启用地形
 */
const setTerrainVisible = (visible) => {
  if (!mapInstance || !mapInstance.viewer) return

  if (visible) {
    const provider = getTerrainProvider()
    mapInstance.hasTerrain = true
    if (provider) {
      mapInstance.viewer.terrainProvider = provider
    }
    mapInstance.viewer.scene.globe.depthTestAgainstTerrain = true
  } else {
    const currentProvider = mapInstance.viewer.terrainProvider
    if (currentProvider && !(currentProvider instanceof Cesium.EllipsoidTerrainProvider)) {
      cachedTerrainProvider = currentProvider
    }
    mapInstance.hasTerrain = false
    mapInstance.viewer.terrainProvider = new Cesium.EllipsoidTerrainProvider()
    mapInstance.viewer.scene.globe.depthTestAgainstTerrain = false
  }
}

const createTdtProvider = (layer) => new Cesium.WebMapTileServiceImageryProvider({
  url: `/t_map/${layer}_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=${layer}&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=${TDT_TOKEN}`,
  layer: 'tdtBasicLayer',
  style: 'default',
  format: 'image/jpeg',
  tileMatrixSetID: 'GoogleMapsCompatible',
  maximumLevel: 18,
})

const removeTdtLayers = () => {
  const imageryLayers = mapInstance?.viewer?.imageryLayers
  if (!imageryLayers) return

  ;[earthMapLayer, earthMapLabelLayer, vectorMapLayer, vectorMapLabelLayer].forEach((layer) => {
    if (layer) imageryLayers.remove(layer)
  })
  earthMapLayer = null
  earthMapLabelLayer = null
  vectorMapLayer = null
  vectorMapLabelLayer = null
}

/**
 * 初始化 Mars3D 地图
 */
const initMarsMap = () => {
  if (!mapDomRef.value) return

  // 合并地图基础配置
  const mapOptions = {
    scene: {
      center: props.defaultCenter,
      showSun: true,
      showMoon: true,
      showSkyBox: true,
      showSkyAtmosphere: true,
      fog: true,
      fxaa: true,
      globe: {
        depthTestAgainstTerrain: true,
        baseColor: '#2b3e4a',
        showGroundAtmosphere: false,
        enableLighting: false,
      },
      cameraController: {
        zoomFactor: 3.0,
        minimumZoomDistance: 10,
        maximumZoomDistance: 50000000,
        enableRotate: true,
        enableTranslate: true,
        enableTilt: true,
        enableZoom: true,
        enableCollisionDetection: true,
      },
      ...(props.options.scene || {}),
    },
    // 1. 数字重庆 30米精度三维地形 Terraria 切片服务
    terrain: {
      url: 'https://application.digitalcq.com/3Dtiles/cq30m2',
      show: true,
      ...(props.options.terrain || {}),
    },
    control: {
      defaultContextMenu: false,
      baseLayerPicker: false,
      sceneModePicker: false,
      vrButton: false,
      fullscreenButton: false,
      navigationHelpButton: false,
      homeButton: false,
      geocoder: false,
      clockAnimate: false,
      timeline: false,
      locationBar: false,
      ...(props.options.control || {}),
    },
    basemaps: props.options.basemaps || [
      // 2. 数字重庆 2025卫星影像服务（CGCS2000 经纬度投影）
      {
        id: 10,
        name: '数字重庆卫星影像',
        type: 'xyz',
        url: 'https://application.digitalcq.com/sjzs/service/RES_2025N05MYX_P0P6/1b4d487351be4416b81d7309da374a35/wmts/fwgl-606007de-a132-9a84-7894-2b455251/cgcs2000/{z}/{x}/{y}.png',
        crs: 'EPSG:4490',
        show: true,
      },
      // 3. 数字重庆试点区影像注记服务（CGCS2000 经纬度投影）
      {
        id: 11,
        name: '数字重庆试点区影像注记',
        type: 'xyz',
        url: 'https://application.digitalcq.com/sjzs/service/RES_YXTZJ_PNFA/8fff3321d7254088af409e256c58f094/tile/{z}/{y}/{x}',
        crs: 'EPSG:4490',
        show: false,
      },
      // 备用：高德影像与路网
      {
        id: 20,
        name: '高德卫星影像',
        type: 'gaode',
        layer: 'img_d',
        show: false,
      },
      {
        id: 21,
        name: '高德路网注记',
        type: 'gaode',
        layer: 'img_z',
        show: false,
      },
    ],
    ...props.options,
  }

  // 创建 Mars3D Map 实例
  mapInstance = new mars3d.Map(mapDomRef.value, mapOptions)

  // 缓存初始化时配置的三维切片地形 Provider
  if (mapInstance.terrainProvider && !(mapInstance.terrainProvider instanceof Cesium.EllipsoidTerrainProvider)) {
    cachedTerrainProvider = mapInstance.terrainProvider
  } else if (mapInstance.viewer?.terrainProvider && !(mapInstance.viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider)) {
    cachedTerrainProvider = mapInstance.viewer.terrainProvider
  }

  // 沿用恩施地灾的 Cesium Navigation 罗盘及交互能力。
  navigationInstance = new CesiumNavigation(mapInstance.viewer, {
    defaultResetView: Cesium.Rectangle.fromDegrees(105.28, 28.10, 110.20, 32.22),
    enableCompass: true,
    enableZoomControls: false,
    enableDistanceLegend: false,
    enableCompassOuterRing: true,
    resetTooltip: '重置视图',
  })

  // 重庆市行政边界使用本地 GeoJSON，页面加载后默认展示。
  chongqingBoundaryLayer = new mars3d.layer.GeoJsonLayer({
    name: '重庆市行政边界',
    data: chongqingBoundary,
    symbol: {
      styleOptions: {
        color: '#007BFF',
        opacity: 0.04,
        outline: true,
        outlineColor: '#DCEDFF',
        outlineWidth: 3,
        clampToGround: true,
      },
    },
  })
  mapInstance.addLayer(chongqingBoundaryLayer)

  // 风险点位使用独立图层，重复定位时只替换当前点位。
  riskPointLayer = new mars3d.layer.GraphicLayer({ name: '风险斜坡定位点' })
  mapInstance.addLayer(riskPointLayer)

  // 挂载到全局方便工具函数以及第三方库直接获取（如 utils/index.js 中的 window._viewer）
  window._map = mapInstance
  window._viewer = mapInstance.viewer

  // 地图单击事件转发
  mapInstance.on(mars3d.EventType.click, (event) => {
    emit('click', event)
  })

  // 监听地形加载错误，降级保障离线或无专网环境下地球正常渲染
  mapInstance.on(mars3d.EventType.terrainLoadError, (event) => {
    console.warn('数字重庆三维地形服务未连通或加载异常，自动降级为标准椭球体:', event)
  })

  // 监听容器尺寸变化（如侧边栏收起展开时自动调整画布）
  if (window.ResizeObserver && mapDomRef.value) {
    resizeObserver = new ResizeObserver(() => {
      if (mapInstance && mapInstance.viewer) {
        mapInstance.viewer.resize()
      }
    })
    resizeObserver.observe(mapDomRef.value)
  }

  // 默认启用试点区影像模式（3D地形 + 底层天地图影像 + 试点区高精影像）
  changeBaseMap('pilot')

  isMapReady.value = true

  // 触发就绪回调
  emit('onload', {
    map: mapInstance,
    viewer: mapInstance.viewer,
    mars3d,
  })
}

/**
 * 放大
 */
const handleZoomIn = () => {
  if (mapInstance) {
    mapInstance.zoomIn()
  }
}

/**
 * 缩小
 */
const handleZoomOut = () => {
  if (mapInstance) {
    mapInstance.zoomOut()
  }
}

/**
 * 切换底图模式
 * @param {'pilot'|'default'|'imagery'|'vector'} type 底图类型
 */
const changeBaseMap = (type = 'pilot') => {
  if (!mapInstance || !mapInstance.viewer) return
  removeTdtLayers()

  const layer10 = mapInstance.getLayerById(10)
  const layer11 = mapInstance.getLayerById(11)
  const imageryLayers = mapInstance.viewer.imageryLayers

  if (type === 'pilot' || type === 'default') {
    // 1. 开启数字重庆 3D 切片地形
    setTerrainVisible(true)

    // 2. 默认叠加到天地图上面：底层添加天地图卫星影像作为全局基底（index 0）
    earthMapLayer = imageryLayers.addImageryProvider(createTdtProvider('img'), 0)
    if (earthMapLayer) {
      imageryLayers.lowerToBottom(earthMapLayer)
    }

    // 3. 上层显示数字重庆试点区高精卫星影像，注记由开关按需显示
    if (layer10) layer10.show = true
    return
  }

  // 切换为天地图模式（矢量 / 纯影像）时，关闭 3D 地形（降级为平整椭球体），隐藏试点区专属图层
  setTerrainVisible(false)
  if (layer10) layer10.show = false
  if (layer11) layer11.show = false

  if (type === 'vector') {
    vectorMapLayer = imageryLayers.addImageryProvider(createTdtProvider('vec'))
    vectorMapLabelLayer = imageryLayers.addImageryProvider(createTdtProvider('cva'))
  } else if (type === 'imagery') {
    earthMapLayer = imageryLayers.addImageryProvider(createTdtProvider('img'))
  }
}

/**
 * 开关指定底图的影像注记
 * @param {{ type: 'pilot'|'imagery', show: boolean }} options 注记所属底图及显示状态
 */
const toggleImageryLabel = ({ type, show }) => {
  const imageryLayers = mapInstance?.viewer?.imageryLayers
  if (!imageryLayers) return

  if (type === 'imagery') {
    // 天地图影像使用 cia 图层作为注记。
    if (earthMapLabelLayer) {
      imageryLayers.remove(earthMapLabelLayer)
      earthMapLabelLayer = null
    }
    if (show && earthMapLayer) {
      earthMapLabelLayer = imageryLayers.addImageryProvider(createTdtProvider('cia'))
    }
  }

  if (type === 'pilot') {
    // 数字重庆电子地图服务仅作为试点区影像的注记层。
    const layer11 = mapInstance.getLayerById(11)
    if (layer11) {
      layer11.show = show
    }
  }
}

/**
 * 重置到初始视角
 */
const flyToHome = () => {
  if (mapInstance) {
    mapInstance.setCameraView(props.defaultCenter, {
      duration: 1.5,
    })
  }
}

/**
 * 定位到指定点位/斜坡单元（供父组件调用）
 */
const flyToPoint = (point, options = {}) => {
  if (!mapInstance) return
  mapInstance.flyToPoint(point, {
    radius: 1200,
    pitch: -45,
    duration: 1.8,
    ...options,
  })
}

/**
 * 展示并聚焦风险斜坡点位
 * @param {{ lng: number, lat: number, alt?: number }} point 点位坐标
 */
const showRiskPoint = async (point) => {
  if (!mapInstance || !riskPointLayer) return

  clearRiskPoint()
  const viewer = mapInstance.viewer
  const requestId = ++riskPointRequestId

  // 与恩施地灾一致：先取得真实地形高程，标记和信息牌始终使用同一个空间锚点。
  let height = Number(point.alt) || 0
  if (viewer.terrainProvider && !(viewer.terrainProvider instanceof Cesium.EllipsoidTerrainProvider)) {
    try {
      const [terrainPosition] = await Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, [
        Cesium.Cartographic.fromDegrees(point.lng, point.lat),
      ])
      if (Number.isFinite(terrainPosition?.height)) {
        height = terrainPosition.height
      }
    } catch (error) {
      console.warn('风险斜坡点位地形高程采样失败，使用接口高程', error)
    }
  }

  // 异步地形采样完成前可能已定位到其他斜坡或关闭面板，忽略过期请求。
  if (requestId !== riskPointRequestId || !mapInstance || !riskPointLayer) return

  const position = new mars3d.LngLatPoint(point.lng, point.lat, height)
  const cartesianPosition = position.toCartesian(true)
  riskPointLayer.addGraphic(new mars3d.graphic.BillboardEntity({
    position,
    style: {
      image: yellowPoint,
      width: 30,
      height: 30,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      clampToGround: false,
    },
  }))
  const updateScreenPosition = () => {
    const viewer = mapInstance?.viewer
    if (!viewer || riskPointLayer?.graphics?.length === 0) return

    const windowPosition = Cesium.SceneTransforms.worldToWindowCoordinates(
      viewer.scene,
      cartesianPosition,
    )
    if (!windowPosition) {
      emit('risk-point-position', null)
      return
    }

    emit('risk-point-position', {
      x: windowPosition.x,
      y: windowPosition.y,
    })
  }
  riskPointPostRenderHandler = updateScreenPosition
  mapInstance.viewer.scene.postRender.addEventListener(riskPointPostRenderHandler)
  updateScreenPosition()
  flyToPoint(position)
}

const clearRiskPoint = () => {
  riskPointRequestId += 1
  if (riskPointPostRenderHandler && mapInstance?.viewer?.scene) {
    mapInstance.viewer.scene.postRender.removeEventListener(riskPointPostRenderHandler)
    riskPointPostRenderHandler = null
  }
  riskPointLayer?.clear()
}

/**
 * 触发画布重绘与尺寸更新
 */
const resize = () => {
  if (mapInstance && mapInstance.viewer) {
    mapInstance.viewer.resize()
  }
}

onMounted(() => {
  initMarsMap()
})

onBeforeUnmount(() => {
  // 清理 ResizeObserver
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  if (navigationInstance) {
    navigationInstance.destroy()
    navigationInstance = null
  }

  // 销毁 Mars3D 地图实例，彻底释放 WebGL 上下文与事件监听，杜绝内存泄漏
  if (mapInstance) {
    clearRiskPoint()
    try {
      mapInstance.destroy()
    } catch (e) {
      console.warn('Map destroy warning:', e)
    }
    mapInstance = null
    cachedTerrainProvider = null
    earthMapLayer = null
    earthMapLabelLayer = null
    vectorMapLayer = null
    vectorMapLabelLayer = null
    chongqingBoundaryLayer = null
    riskPointLayer = null
    riskPointPostRenderHandler = null
  }

  // 清除全局变量挂载
  if (window._map) {
    window._map = null
  }
  if (window._viewer) {
    window._viewer = null
  }
})

defineExpose({
  getMap: () => mapInstance,
  getViewer: () => mapInstance?.viewer,
  flyToHome,
  flyToPoint,
  showRiskPoint,
  clearRiskPoint,
  handleZoomIn,
  handleZoomOut,
  changeBaseMap,
  toggleImageryLabel,
  resize,
  getAreaSearch: () => areaSearchRef.value,
})
</script>

<style lang="less" scoped>
.mars-map-component {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100%;
  overflow: hidden;
  user-select: none;
  border-radius: 16px;
  -webkit-mask-image: -webkit-radial-gradient(white, black);
  mask-image: radial-gradient(white, black);
  transform: translateZ(0);
}

.mars3d-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: inherit;
  -webkit-mask-image: -webkit-radial-gradient(white, black);
  mask-image: radial-gradient(white, black);
  transform: translateZ(0);
}

/* 隐藏 Cesium 默认版权与组件 */
:deep(.cesium-widget-credits),
:deep(.cesium-credit-logoContainer),
:deep(.cesium-credit-textContainer) {
  display: none !important;
}

/* 强制 Cesium WebGL 硬件加速画布遵循 16px 圆角裁切，防止 macOS/Chrome GPU 穿透直角 */
:deep(.cesium-widget),
:deep(.cesium-widget canvas) {
  border-radius: 16px !important;
  overflow: hidden !important;
}

/* 恩施地灾原生罗盘样式，交互由 cesium-navigation-es6 提供。 */
:deep(.compass) {
  top: auto;
  right: 7px;
  bottom: 196px;
  width: 55px;
  height: 55px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  background: rgba(128, 128, 128, 0.5);
}

:deep(.compass-outer-ring-background) {
  top: 0;
  left: 0;
  width: 15px;
  height: 15px;
  border: 20px solid transparent;
  border-radius: 50%;
}

:deep(.compass-outer-ring) {
  top: 0;
  left: -1px;
  width: 55px;
  height: 55px;
  background-image: url('@/assets/imgs/map-controls/compass.svg'), url('@/assets/imgs/map-controls/compass-border.png');
  background-position: center;
  background-size: 20px 20px, 40px 40px;
  background-repeat: no-repeat;
}

:deep(.compass-gyro),
:deep(.compass-gyro-background) {
  display: none;
}

:deep(.compass-rotation-marker) {
  width: 55px;
  height: 55px;
  fill: #1890ff;
  z-index: 10;
}
</style>
