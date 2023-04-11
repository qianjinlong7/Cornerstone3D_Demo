import ptScalingMetaDataProvider from './helpers/ptScalingMetaDataProvider';
import { calculateSUVScalingFactors } from '@cornerstonejs/calculate-suv';
const fs = window.require('fs')
const path = window.require('path')
const sep = path.sep
const dicomParser = require('dicom-parser')

// const loadImages = (outputpath) => {  // 加载Listbody中所选项对应的文件名数组
//   let series = []
//   let ct_in = outputpath.split('_')[1]
//   //let folders = [outputpath + sep + 'PET_in', outputpath + sep + 'PET_out', '/home/radyn/.config/RaDynNucCAD/config/input/NNUNET/NNUNET_'+ct_in+'_CT']
//   let folders = [outputpath + sep + 'PET_in', outputpath + sep + 'PET_out', outputpath + sep + 'CT_out']
//   for (let i = 0; i < folders.length; i++) {
//     let viewpath = folders[i]   // ‘.../PET_in’ || '.../PET_out' || '.../CT_out'
//     let filespath = fs.readdirSync(viewpath)  // 读取viewpath下的各个文件名，并返回读取到的结果
//     let map = {}
//     let arr = []
//     let imageIds = []
//     let temp_content = fs.readFileSync(viewpath + sep + filespath[0]);
//     let temp_contentParsed = dicomParser.parseDicom(temp_content);
//     let modality = temp_contentParsed.string('x00080060');   
//     console.log(modality);
//     if (i === 0) {
//       for (let i = 0; i < filespath.length; i++) {
//         arr[i] = 'wadouri:file:///' + viewpath + sep + filespath[i];
//         imageIds[i] = arr[i]
//       }
//     }
//     else {
//       for (let i = 0; i < filespath.length; i++) {
//         let instancenum = filespath[i].split('_')[1].split('.')[0];
//         map[instancenum] = i;
//         arr[i] = instancenum;
//       }
//       arr.sort(function (a, b) { return a - b })
//       let arrp = []
//       for (let i = 0; i < arr.length; i++) {
//         let k = arr[i];
//         arrp[i] = 'wadouri:file:///' + viewpath + sep + filespath[map[k]];
//         imageIds[i] = arrp[i]
//       }
//     }

//     if (modality === 'PT') {
//       const InstanceMetadataArray = [];
//       imageIds.forEach((imageId) => {
//         console.log(imageId)
//         //const instanceMetadata = getPTImageIdInstanceMetadata(imageId);
//         const instanceMetadata = {
//           CorrectedImage: ['DECY', 'ATTN', 'SCAT', 'DTIM', 'RAN', 'RADL', 'DCAL', 'SLSENS', 'NORM'],
//           Units: "BQML",
//           RadionuclideHalfLife: 6586.2001953125,
//           RadionuclideTotalDose: 117607984,
//           DecayCorrection: "START",
//           PatientWeight: 64,
//           SeriesDate: "20230112",
//           SeriesTime: "123843",
//           AcquisitionDate: "20230112",
//           AcquisitionTime: "125255",
//           ActualFrameDuration:120000,
//           PatientSex:"M",
//           PatientSize:1.75,
//           RadiopharmaceuticalStartTime:"120000.00",
//         };
//         console.log(instanceMetadata)
//         if (typeof instanceMetadata.CorrectedImage === 'string') {
//           instanceMetadata.CorrectedImage =
//             instanceMetadata.CorrectedImage.split('\\');
//         }

//         if (instanceMetadata) {
//           InstanceMetadataArray.push(instanceMetadata);
//         }
//     });
//        if (InstanceMetadataArray.length) {
//         const suvScalingFactors = calculateSUVScalingFactors(
//           InstanceMetadataArray
//         );
//         InstanceMetadataArray.forEach((instanceMetadata, index) => {
//           ptScalingMetaDataProvider.addInstance(
//             imageIds[index],
//             suvScalingFactors[index]
//           );
//         });
//       }
//     } 
//     series.push(imageIds)
//   }
//   console.log('OK');
//   return series
// }

const loadImages = (outputpath) => {  // 加载Listbody中所选项对应的文件名数组
  let series = []
  let ct_in = outputpath.split('_')[1]
  //let folders = [outputpath + sep + 'PET_in', outputpath + sep + 'PET_out', '/home/radyn/.config/RaDynNucCAD/config/input/NNUNET/NNUNET_'+ct_in+'_CT']
  let folders = [outputpath + sep + 'PET_in', outputpath + sep + 'PET_out', outputpath + sep + 'CT_out']
  for (let i = 0; i < folders.length; i++) {
    let viewpath = folders[i]   // ‘.../PET_in’ || '.../PET_out' || '.../CT_out'
    let filespath = fs.readdirSync(viewpath)  // 读取viewpath下的各个文件名，并返回读取到的结果
    let map = {}
    let arr = []
    let imageIds = []
    let temp_content = fs.readFileSync(viewpath + sep + filespath[0]);
    let temp_contentParsed = dicomParser.parseDicom(temp_content);
    let modality = temp_contentParsed.string('x00080060');
    for (let i = 0; i < filespath.length; i++) {
      let content = fs.readFileSync(viewpath + '/' + filespath[i]);
      let contentParsed = dicomParser.parseDicom(content);
      let instancenum = contentParsed.string('x00200013');
      map[instancenum] = i;
      arr[i] = instancenum;
    }
    arr.sort(function (a, b) { return a - b })
    let arrp = []
    for (let i = 0; i < arr.length; i++) {
      let k = arr[i];
      arrp[i] = 'wadouri:file:///' + viewpath + sep + filespath[map[k]];
      imageIds[i] = arrp[i]
    }
    if (modality === 'PT') {
      const InstanceMetadataArray = [];
      imageIds.forEach((imageId) => {
        //const instanceMetadata = getPTImageIdInstanceMetadata(imageId);
        const correctedImage = temp_contentParsed.string('x00280051')
        const units = temp_contentParsed.string('x00541001')
        const radionuclideHalfLife = temp_contentParsed.elements.x00540016.items[0].dataSet.string('x00181072')
        const radionuclideTotalDose = temp_contentParsed.elements.x00540016.items[0].dataSet.string('x00181074')
        const decayCorrection = temp_contentParsed.string('x00541102')
        const patientWeight = temp_contentParsed.string('x00101030')
        const seriesDate = temp_contentParsed.string('x00080021')
        const seriesTime = temp_contentParsed.string('x00080031')
        const acquisitionDate = temp_contentParsed.string('x00080022')
        const acquisitionTime = temp_contentParsed.string('x00080032')
        const actualFrameDuration = temp_contentParsed.string('x00181242')
        const patientSex = temp_contentParsed.string('x00100040')
        const patientSize = temp_contentParsed.string('x00101020')
        const radiopharmaceuticalStartTime = temp_contentParsed.elements.x00540016.items[0].dataSet.string('x00181072')
        const instanceMetadata = {
          CorrectedImage: correctedImage,
          Units: units,
          RadionuclideHalfLife: radionuclideHalfLife,
          RadionuclideTotalDose: radionuclideTotalDose,
          DecayCorrection: decayCorrection,
          PatientWeight: patientWeight,
          SeriesDate: seriesDate,
          SeriesTime: seriesTime,
          AcquisitionDate: acquisitionDate,
          AcquisitionTime: acquisitionTime,
          ActualFrameDuration: actualFrameDuration,
          PatientSex: patientSex,
          PatientSize: patientSize,
          RadiopharmaceuticalStartTime: radiopharmaceuticalStartTime,
        };
        // CorrectedImage: ['DECY', 'ATTN', 'SCAT', 'DTIM', 'RAN', 'RADL', 'DCAL', 'SLSENS', 'NORM'],
        // Units: "BQML",
        // RadionuclideHalfLife: 6586.2001953125,
        // RadionuclideTotalDose: 117607984,
        // DecayCorrection: "START",
        // PatientWeight: 64,
        // SeriesDate: "20230112",
        // SeriesTime: "123843",
        // AcquisitionDate: "20230112",
        // AcquisitionTime: "125255",
        // ActualFrameDuration:120000,
        // PatientSex:"M",
        // PatientSize:1.75,
        // RadiopharmaceuticalStartTime:"120000.00",
        if (typeof instanceMetadata.CorrectedImage === 'string') {
          instanceMetadata.CorrectedImage =
            instanceMetadata.CorrectedImage.split('\\');
        }

        if (instanceMetadata) {
          InstanceMetadataArray.push(instanceMetadata);
        }
      });
      if (InstanceMetadataArray.length) {
        const suvScalingFactors = calculateSUVScalingFactors(
          InstanceMetadataArray
        );
        InstanceMetadataArray.forEach((instanceMetadata, index) => {
          ptScalingMetaDataProvider.addInstance(
            imageIds[index],
            suvScalingFactors[index]
          );
        });
      }
    }
    //console.log(input_series);
    series.push(imageIds)
  }
  //console.log(series);//读的已经是带wado的路径了
  //console.log(series[1]);
  return series
}

export default loadImages