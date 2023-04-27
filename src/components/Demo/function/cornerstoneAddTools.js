import * as cornerstoneTools from '@cornerstonejs/tools'

const {
  ToolGroupManager,
  Enums: csToolsEnums,
  WindowLevelTool,
  PanTool,
  ZoomTool,
  StackScrollMouseWheelTool,
  DragProbeTool,
  CrosshairsTool,
} = cornerstoneTools
const { MouseBindings } = csToolsEnums

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
const volumeLoaderScheme = 'cornerstoneStreamingImageVolume'; // Loader id which defines which volume loader to use
const ctVolumeName = 'CT_VOLUME_ID'; // Id of the volume less loader prefix
const ctVolumeId = `${volumeLoaderScheme}:${ctVolumeName}`; // VolumeId with loader id + volume id
const ptVolumeName = 'PT_VOLUME_ID';
const ptVolumeId = `${volumeLoaderScheme}:${ptVolumeName}`;

cornerstoneTools.addTool(StackScrollMouseWheelTool)
cornerstoneTools.addTool(WindowLevelTool)
cornerstoneTools.addTool(ZoomTool)
cornerstoneTools.addTool(PanTool)
cornerstoneTools.addTool(DragProbeTool)
cornerstoneTools.addTool(CrosshairsTool)

const ctToolGroupId = "CT_TOOLGROUP_ID"
const ptToolGroupId = 'PT_TOOLGROUP_ID'
const fusionToolGroupId = 'FUSION_TOOLGROUP_ID'
const ctToolGroup = ToolGroupManager.createToolGroup(ctToolGroupId)
const ptToolGroup = ToolGroupManager.createToolGroup(ptToolGroupId)
const fusionToolGroup = ToolGroupManager.createToolGroup(fusionToolGroupId)

const viewportColors = {
  [viewportIds.CT.AXIAL]: 'rgb(200, 0, 0)',
  [viewportIds.CT.SAGITTAL]: 'rgb(200, 200, 0)',
  [viewportIds.CT.CORONAL]: 'rgb(0, 200, 0)',
  [viewportIds.PT.AXIAL]: 'rgb(200, 0, 0)',
  [viewportIds.PT.SAGITTAL]: 'rgb(200, 200, 0)',
  [viewportIds.PT.CORONAL]: 'rgb(0, 200, 0)',
  [viewportIds.FUSION.AXIAL]: 'rgb(200, 0, 0)',
  [viewportIds.FUSION.SAGITTAL]: 'rgb(200, 200, 0)',
  [viewportIds.FUSION.CORONAL]: 'rgb(0, 200, 0)',
};
const viewportReferenceLineControllable = [
  viewportIds.CT.AXIAL,
  viewportIds.CT.SAGITTAL,
  viewportIds.CT.CORONAL,
  viewportIds.PT.AXIAL,
  viewportIds.PT.SAGITTAL,
  viewportIds.PT.CORONAL,
  viewportIds.FUSION.AXIAL,
  viewportIds.FUSION.SAGITTAL,
  viewportIds.FUSION.CORONAL,
];
const viewportReferenceLineDraggableRotatable = [
  viewportIds.CT.AXIAL,
  viewportIds.CT.SAGITTAL,
  viewportIds.CT.CORONAL,
  viewportIds.PT.AXIAL,
  viewportIds.PT.SAGITTAL,
  viewportIds.PT.CORONAL,
  viewportIds.FUSION.AXIAL,
  viewportIds.FUSION.SAGITTAL,
  viewportIds.FUSION.CORONAL,
];
const viewportReferenceLineSlabThicknessControlsOn = [
  viewportIds.CT.AXIAL,
  viewportIds.CT.SAGITTAL,
  viewportIds.CT.CORONAL,
  viewportIds.PT.AXIAL,
  viewportIds.PT.SAGITTAL,
  viewportIds.PT.CORONAL,
  viewportIds.FUSION.AXIAL,
  viewportIds.FUSION.SAGITTAL,
  viewportIds.FUSION.CORONAL,
];
function getReferenceLineColor(viewportId) {
  return viewportColors[viewportId];
}
function getReferenceLineControllable(viewportId) {
  const index = viewportReferenceLineControllable.indexOf(viewportId);
  return index !== -1;
}
function getReferenceLineDraggableRotatable(viewportId) {
  const index = viewportReferenceLineDraggableRotatable.indexOf(viewportId);
  return index !== -1;
}
function getReferenceLineSlabThicknessControlsOn(viewportId) {
  const index =
    viewportReferenceLineSlabThicknessControlsOn.indexOf(viewportId);
  return index !== -1;
}

[ctToolGroup, ptToolGroup, fusionToolGroup].forEach((toolGroup) => {
  toolGroup.addTool(StackScrollMouseWheelTool.toolName)
  toolGroup.addTool(ZoomTool.toolName)
  toolGroup.addTool(PanTool.toolName)
  toolGroup.addTool(DragProbeTool.toolName)
})
ctToolGroup.addTool(WindowLevelTool.toolName)
ptToolGroup.addTool(WindowLevelTool.toolName)
fusionToolGroup.addTool(WindowLevelTool.toolName, {
  volumeId: ptVolumeId,
})
ctToolGroup.addTool(CrosshairsTool.toolName, {
  getReferenceLineColor,
  getReferenceLineControllable,
  getReferenceLineDraggableRotatable,
  getReferenceLineSlabThicknessControlsOn,
});
ptToolGroup.addTool(CrosshairsTool.toolName, {
  getReferenceLineColor,
  getReferenceLineControllable,
  getReferenceLineDraggableRotatable,
  getReferenceLineSlabThicknessControlsOn,
});
fusionToolGroup.addTool(CrosshairsTool.toolName, {
  getReferenceLineColor,
  getReferenceLineControllable,
  getReferenceLineDraggableRotatable,
  getReferenceLineSlabThicknessControlsOn,
  // Only set CT volume to MIP in the fusion viewport
  filterActorUIDsToSetSlabThickness: [ctVolumeId],
});

[ctToolGroup, ptToolGroup, fusionToolGroup].forEach((toolGroup) => {
  toolGroup.setToolActive(WindowLevelTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Primary, // Left Click
      },
    ],
  });
  toolGroup.setToolActive(PanTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Auxiliary, // Middle Click
      },
    ],
  });
  toolGroup.setToolActive(ZoomTool.toolName, {
    bindings: [
      {
        mouseButton: MouseBindings.Secondary, // Right Click
      },
    ],
  });

  toolGroup.setToolActive(StackScrollMouseWheelTool.toolName);
  // toolGroup.setToolPassive(CrosshairsTool.toolName);
});

export { ctToolGroup, ptToolGroup, fusionToolGroup }