import * as cornerstoneTools from '@cornerstonejs/tools';

const { synchronizers, } = cornerstoneTools;
const { createCameraPositionSynchronizer, createVOISynchronizer } = synchronizers;

const setUpSynchronizers = (renderingEngineId, viewportIds) => {
  const axialCameraSynchronizerId = 'AXIAL_CAMERA_SYNCHRONIZER_ID';
  const sagittalCameraSynchronizerId = 'SAGITTAL_CAMERA_SYNCHRONIZER_ID';
  const coronalCameraSynchronizerId = 'CORONAL_CAMERA_SYNCHRONIZER_ID';
  const ctVoiSynchronizerId = 'CT_VOI_SYNCHRONIZER_ID';
  const ptVoiSynchronizerId = 'PT_VOI_SYNCHRONIZER_ID';

  const axialCameraPositionSynchronizer = createCameraPositionSynchronizer(
    axialCameraSynchronizerId
  );
  const sagittalCameraPositionSynchronizer = createCameraPositionSynchronizer(
    sagittalCameraSynchronizerId
  );
  const coronalCameraPositionSynchronizer = createCameraPositionSynchronizer(
    coronalCameraSynchronizerId
  );
  const ctVoiSynchronizer = createVOISynchronizer(ctVoiSynchronizerId);
  const ptVoiSynchronizer = createVOISynchronizer(ptVoiSynchronizerId);

  // Add viewports to camera synchronizers
  [
    viewportIds.CT.AXIAL,
    viewportIds.PT.AXIAL,
    viewportIds.FUSION.AXIAL,
  ].forEach((viewportId) => {
    axialCameraPositionSynchronizer.add({
      renderingEngineId,
      viewportId,
    });
  });
  [
    viewportIds.CT.SAGITTAL,
    viewportIds.PT.SAGITTAL,
    viewportIds.FUSION.SAGITTAL,
  ].forEach((viewportId) => {
    sagittalCameraPositionSynchronizer.add({
      renderingEngineId,
      viewportId,
    });
  });
  [
    viewportIds.CT.CORONAL,
    viewportIds.PT.CORONAL,
    viewportIds.FUSION.CORONAL,
  ].forEach((viewportId) => {
    coronalCameraPositionSynchronizer.add({
      renderingEngineId,
      viewportId,
    });
  });

  // Add viewports to VOI synchronizers
  [
    viewportIds.CT.AXIAL,
    viewportIds.CT.SAGITTAL,
    viewportIds.CT.CORONAL,
  ].forEach((viewportId) => {
    ctVoiSynchronizer.add({
      renderingEngineId,
      viewportId,
    });
  });
  [
    viewportIds.FUSION.AXIAL,
    viewportIds.FUSION.SAGITTAL,
    viewportIds.FUSION.CORONAL,
  ].forEach((viewportId) => {
    // In this example, the fusion viewports are only targets for CT VOI
    // synchronization, not sources
    ctVoiSynchronizer.addTarget({
      renderingEngineId,
      viewportId,
    });
  });
  [
    viewportIds.PT.AXIAL,
    viewportIds.PT.SAGITTAL,
    viewportIds.PT.CORONAL,
    viewportIds.FUSION.AXIAL,
    viewportIds.FUSION.SAGITTAL,
    viewportIds.FUSION.CORONAL,
    // viewportIds.PETMIP.CORONAL,
  ].forEach((viewportId) => {
    ptVoiSynchronizer.add({
      renderingEngineId,
      viewportId,
    });
  });
}

export default setUpSynchronizers
