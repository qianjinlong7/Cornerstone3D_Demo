import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Table } from 'antd'
import axios from 'axios'
import './index.less'

export default function List() {
  const navigate = useNavigate()
  const [patientList, setPatientList] = useState([])

  useEffect(() => {
    axios.get('/getPatientList').then(value => {
      const tempList = value.data.map((item, index) => {
        return { key: index, ...item }
      })
      setPatientList(tempList)
    })
  }, [])

  const columns = [
    {
      title: '病人ID',
      dataIndex: 'pID',
      key: 'pID',
      width: '15%',
      ellipsis: true,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: '15%',
      ellipsis: true,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      width: '15%',
      ellipsis: true,
    },
    {
      title: '生日',
      dataIndex: 'birthday',
      key: 'birthday',
      width: '15%',
      ellipsis: true,
    },
    {
      title: '扫描模态',
      dataIndex: 'scanMode',
      key: 'scanMode',
      width: '15%',
      ellipsis: true,
    },
    {
      title: '扫描时间',
      dataIndex: 'scanTime',
      key: 'scanTime',
      width: '15%',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'operation',
      render: (text) => (
        <div >
          <a onClick={() => navigate('/demo', { state: { dicomPath: text.path } })} style={{ marginRight: 20 }}>查看</a>
        </div>
      ),
      width: '10%',
      ellipsis: true,
    },
  ]

  return (
    <div>
      <Table
        id='patientTable'
        columns={columns}
        dataSource={patientList}
        pagination={{
          showSizeChanger: false,
          position: ['bottomCenter']
        }}
      />
    </div>
  )
}
