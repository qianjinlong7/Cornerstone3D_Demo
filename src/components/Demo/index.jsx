import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router'
import {
  RenderingEngine,
  Types,
  Enums,
  setVolumesForViewports,
  volumeLoader,
  getRenderingEngine,
  resetUseCPURendering,
  utilities
} from "@cornerstonejs/core"
import { calculateSUVScalingFactors } from "@cornerstonejs/calculate-suv";
import { initDemo, createImageIdsAndCacheMetaData, setPetColorMapTransferFunctionForVolumeActor, setCtTransferFunctionForVolumeActor, setPetTransferFunctionForVolumeActor } from "./function/helpers"
import ctToolGroup from './function/cornerstoneAddTools'
import axios from 'axios'
import './index.less'

let flag = false
let renderingEngine
const renderingEngineId = "myRenderingEngine"
const { ViewportType, BlendModes } = Enums
const volumeLoaderScheme = 'cornerstoneStreamingImageVolume'
const ctVolumeName = 'CT_VOLUME_ID'
const ctVolumeId = `${volumeLoaderScheme}:${ctVolumeName}`
const ptVolumeName = 'PT_VOLUME_ID'
const ptVolumeId = `${volumeLoaderScheme}:${ptVolumeName}`
const viewportIds = {
  CT: { AXIAL: 'CT_AXIAL', SAGITTAL: 'CT_SAGITTAL', CORONAL: 'CT_CORONAL' },
  PT: { AXIAL: 'PT_AXIAL', SAGITTAL: 'PT_SAGITTAL', CORONAL: 'PT_CORONAL' },
  FUSION: {
    AXIAL: 'FUSION_AXIAL',
    SAGITTAL: 'FUSION_SAGITTAL',
    CORONAL: 'FUSION_CORONAL',
  },
  PETMIP: {
    CORONAL: 'PET_MIP_CORONAL',
  },
}

const initAndGetImageIds = async outputpath => {
  await initDemo()
  const wadoRsRoot = 'https://d3t6nz73ql33tx.cloudfront.net/dicomweb';
  const StudyInstanceUID =
    '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463';

  // Get Cornerstone imageIds and fetch metadata into RAM
  const ctImageIds = await createImageIdsAndCacheMetaData({
    StudyInstanceUID,
    SeriesInstanceUID:
      '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
    wadoRsRoot,
  });
  const ptImageIds = await createImageIdsAndCacheMetaData({
    StudyInstanceUID,
    SeriesInstanceUID:
      '1.3.6.1.4.1.14519.5.2.1.7009.2403.879445243400782656317561081015',
    wadoRsRoot,
  });
  /* console.log('start')
  const imageIds = loadImages(outputpath)
  let [in_imageIds, out_imageIds, ct_imageIds] = imageIds
  console.log(imageIds) */

  const imageIds = [ctImageIds, ptImageIds]

  return new Promise((resolve, reject) => {
    resolve(imageIds)
  })
}

const getVolumeAndRender = async (imageIds, elements, renderingEngineId, renderingEngine, viewportIds) => {
  let [in_imageIds, out_imageIds, ct_imageIds] = imageIds
  const ct_volume = await volumeLoader.createAndCacheVolume(ctVolumeId, {
    imageIds: in_imageIds,
  })

  // in_imageIds = convertMultiframeImageIds(in_imageIds);
  /* in_imageIds.forEach((imageId) => {
    let instanceMetaData =
      cornerstoneWADOImageLoader.wadors.metaDataManager.get(imageId);
    instanceMetaData = JSON.parse(JSON.stringify(instanceMetaData));
    if (instanceMetaData) {
      // Add calibrated pixel spacing
      const metadata = DicomMetaDictionary.naturalizeDataset(instanceMetaData);
      const pixelSpacing = getPixelSpacingInformation(metadata);

      if (pixelSpacing) {
        calibratedPixelSpacingMetadataProvider.add(
          imageId,
          pixelSpacing.map((s) => parseFloat(s))
        );
      }
    }
  }); */
  //@ts-ignore
  /* const InstanceMetadataArray = [];
  in_imageIds.forEach((imageId, index) => {
    // const instanceMetadata = getPTImageIdInstanceMetadata(imageId);
    const instanceMetadata = {
      CorrectedImage: ['DECY', 'ATTN', 'SCAT', 'DTIM', 'RAN', 'RADL', 'DCAL', 'SLSENS', 'NORM'],
      Units: "BQML",
      RadionuclideHalfLife: 6586.2001953125,
      RadionuclideTotalDose: 117607984,
      DecayCorrection: "START",
      PatientWeight: 64,
      SeriesDate: "20230112",
      SeriesTime: "123843",
      AcquisitionDate: "20230112",
      AcquisitionTime: "125255",
      ActualFrameDuration: 120000,
      PatientSex: "M",
      PatientSize: 1.75,
      RadiopharmaceuticalStartTime: "120000.00",
    };

    if (instanceMetadata) {
      InstanceMetadataArray.push(instanceMetadata);
    }
  });
  if (InstanceMetadataArray.length) {
    //@ts-ignore
    const suvScalingFactors = calculateSUVScalingFactors(InstanceMetadataArray);
    //@ts-ignore
    InstanceMetadataArray.forEach((instanceMetadata, index) => {
      ptScalingMetaDataProvider.addInstance(
        in_imageIds[index],
        suvScalingFactors[index]
      );
    });
  } */

  const pet_volume = await volumeLoader.createAndCacheVolume(ptVolumeId, {
    imageIds: out_imageIds,
  })

  const viewportInputArray = [
    {
      viewportId: viewportIds.CT.AXIAL,
      type: ViewportType.ORTHOGRAPHIC,
      element: elements[0],
      defaultOptions: {
        orientation: Enums.OrientationAxis.AXIAL,
      },
    },
    {
      viewportId: viewportIds.CT.SAGITTAL,
      type: ViewportType.ORTHOGRAPHIC,
      element: elements[1],
      defaultOptions: {
        orientation: Enums.OrientationAxis.SAGITTAL,
      },
    },
    {
      viewportId: viewportIds.CT.CORONAL,
      type: ViewportType.ORTHOGRAPHIC,
      element: elements[2],
      defaultOptions: {
        orientation: Enums.OrientationAxis.CORONAL,
      },
    },
    {
      viewportId: viewportIds.PT.AXIAL,
      type: ViewportType.ORTHOGRAPHIC,
      element: elements[3],
      defaultOptions: {
        orientation: Enums.OrientationAxis.AXIAL,
      },
    },
    {
      viewportId: viewportIds.PT.SAGITTAL,
      type: ViewportType.ORTHOGRAPHIC,
      element: elements[4],
      defaultOptions: {
        orientation: Enums.OrientationAxis.SAGITTAL,
      },
    },
    {
      viewportId: viewportIds.PT.CORONAL,
      type: ViewportType.ORTHOGRAPHIC,
      element: elements[5],
      defaultOptions: {
        orientation: Enums.OrientationAxis.CORONAL,
      },
    },
    {
      viewportId: viewportIds.FUSION.AXIAL,
      type: ViewportType.ORTHOGRAPHIC,
      element: elements[6],
      defaultOptions: {
        orientation: Enums.OrientationAxis.AXIAL,
      },
    },
    {
      viewportId: viewportIds.FUSION.SAGITTAL,
      type: ViewportType.ORTHOGRAPHIC,
      element: elements[7],
      defaultOptions: {
        orientation: Enums.OrientationAxis.SAGITTAL,
      },
    },
    {
      viewportId: viewportIds.FUSION.CORONAL,
      type: ViewportType.ORTHOGRAPHIC,
      element: elements[8],
      defaultOptions: {
        orientation: Enums.OrientationAxis.CORONAL,
      },
    },
  ]
  renderingEngine.setViewports(viewportInputArray)
  ct_volume.load()
  pet_volume.load()

  await setVolumesForViewports(
    renderingEngine,
    [
      {
        volumeId: ctVolumeId,
        callback: setCtTransferFunctionForVolumeActor,
      },
    ],
    [viewportIds.CT.AXIAL, viewportIds.CT.SAGITTAL, viewportIds.CT.CORONAL]
  )
  await setVolumesForViewports(
    renderingEngine,
    [
      {
        volumeId: ptVolumeId,
        callback: setPetTransferFunctionForVolumeActor,
      },
    ],
    [viewportIds.PT.AXIAL, viewportIds.PT.SAGITTAL, viewportIds.PT.CORONAL]
  )
  await setVolumesForViewports(
    renderingEngine,
    [
      {
        volumeId: ctVolumeId,
        callback: setCtTransferFunctionForVolumeActor,
      },
      {
        volumeId: ptVolumeId,
        // callback: setPetTransferFunctionForVolumeActor,
        callback: setPetColorMapTransferFunctionForVolumeActor,
      }
    ],
    [viewportIds.FUSION.AXIAL, viewportIds.FUSION.SAGITTAL, viewportIds.FUSION.CORONAL]
  )
  // renderingEngine.renderViewports([viewportIds.CT.AXIAL, viewportIds.PT.AXIAL])
  ctToolGroup.addViewport(viewportIds.CT.AXIAL, renderingEngineId);
  ctToolGroup.addViewport(viewportIds.CT.SAGITTAL, renderingEngineId);
  ctToolGroup.addViewport(viewportIds.CT.CORONAL, renderingEngineId);
  ctToolGroup.addViewport(viewportIds.PT.AXIAL, renderingEngineId);
  ctToolGroup.addViewport(viewportIds.PT.SAGITTAL, renderingEngineId);
  ctToolGroup.addViewport(viewportIds.PT.CORONAL, renderingEngineId);
  ctToolGroup.addViewport(viewportIds.FUSION.AXIAL, renderingEngineId);
  ctToolGroup.addViewport(viewportIds.FUSION.SAGITTAL, renderingEngineId);
  ctToolGroup.addViewport(viewportIds.FUSION.CORONAL, renderingEngineId);
  renderingEngine.render()
}

export default function Demo() {
  const localhost = useLocation()
  const { dicomPath } = localhost.state
  const [ImageIds, setImageIds] = useState(null)

  useEffect(() => {
    if (!flag) {
      flag = true
      const imageIds = initAndGetImageIds()
      imageIds.then((value) => {
        setImageIds(value)
        renderingEngine = new RenderingEngine(renderingEngineId)
        const elements = document.getElementsByClassName("element")
        getVolumeAndRender(value, elements, renderingEngineId, renderingEngine, viewportIds)
      })
    }
  }, [])

  useEffect(() => {
    axios.post('/getDICOM', { dicomPath }).then(value => {

    })
  }, [])

  return (
    <div className="ImgShow" id="content">
      <div className="viewportGrid" id="viewportGrid">
        <div className="element element1_1" onContextMenu={(e) => e.preventDefault()}></div>
        <div className="element element1_2" onContextMenu={(e) => e.preventDefault()}></div>
        <div className="element element1_3" onContextMenu={(e) => e.preventDefault()}></div>
        <div className="element element2_1" onContextMenu={(e) => e.preventDefault()}></div>
        <div className="element element2_2" onContextMenu={(e) => e.preventDefault()}></div>
        <div className="element element2_3" onContextMenu={(e) => e.preventDefault()}></div>
        <div className="element element3_1" onContextMenu={(e) => e.preventDefault()}></div>
        <div className="element element3_2" onContextMenu={(e) => e.preventDefault()}></div>
        <div className="element element3_3" onContextMenu={(e) => e.preventDefault()}></div>
      </div>
    </div>
  )
}
