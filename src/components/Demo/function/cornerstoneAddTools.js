import * as cornerstoneTools from '@cornerstonejs/tools'

const {
  ToolGroupManager,
  Enums: csToolsEnums,
  WindowLevelTool,
  PanTool,
  ZoomTool,
  StackScrollMouseWheelTool,
  DragProbeTool,
  synchronizers,
  MIPJumpToClickTool,
  VolumeRotateMouseWheelTool,
  CrosshairsTool,
} = cornerstoneTools
const { MouseBindings } = csToolsEnums

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

const ctToolGroupId = "CT_TOOLGROUP_ID"
const ctToolGroup = ToolGroupManager.createToolGroup(ctToolGroupId)

ctToolGroup.addTool(StackScrollMouseWheelTool.toolName)
ctToolGroup.addTool(WindowLevelTool.toolName, {
  volumeId: ctVolumeId,
})
ctToolGroup.addTool(ZoomTool.toolName)
ctToolGroup.addTool(PanTool.toolName)
ctToolGroup.addTool(DragProbeTool.toolName)

ctToolGroup.setToolActive(StackScrollMouseWheelTool.toolName)
/* ctToolGroup.setToolPassive(WindowLevelTool.toolName)
ctToolGroup.setToolPassive(ZoomTool.toolName)
ctToolGroup.setToolPassive(PanTool.toolName)
ctToolGroup.setToolPassive(DragProbeTool.toolName) */

export default ctToolGroup