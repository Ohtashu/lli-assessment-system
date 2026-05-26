import React, { useState, useEffect } from 'react'
import {
  Layout,
  Button,
  Row,
  Col,
  Card,
  Statistic,
  Table,
  Space,
  Spin,
  Alert,
  Popconfirm,
} from 'antd'
import { LogoutOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import '../styles/DashboardPage.css'

const { Header, Content } = Layout

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [assets, setAssets] = useState([])
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [assetsRes, reportRes] = await Promise.all([
        api.get('/assets'),
        api.get('/reports/summary'),
      ])

      setAssets(assetsRes.data?.data || [])
      setReport(reportRes.data?.data || {})
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/assets/${id}`)
      setAssets(assets.filter((a) => a.id !== id))
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete asset')
    }
  }

  const columns = [
    {
      title: 'Asset Tag',
      dataIndex: 'asset_tag',
      key: 'asset_tag',
      width: 120,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 100,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        let color = 'green'
        if (status === 'In Repair') color = 'orange'
        if (status === 'Retired') color = 'red'
        return <span style={{ color }}>{status}</span>
      },
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      ellipsis: true,
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      render: (value) => `$${value?.toLocaleString() || 0}`,
      width: 100,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => console.log('Edit', record.id)}
          />
          <Popconfirm
            title="Delete Asset"
            description="Are you sure you want to delete this asset?"
            onConfirm={() => handleDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button danger size="small" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <Layout className="dashboard-layout">
      <Header className="dashboard-header">
        <div className="header-left">
          <h1 className="header-title">LLI Assessment System</h1>
        </div>
        <div className="header-right">
          <span className="user-info">Welcome, {user?.name}</span>
          <Button
            type="text"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </Header>

      <Content className="dashboard-content">
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            closable
            onClose={() => setError(null)}
            style={{ marginBottom: 16 }}
          />
        )}

        <Spin spinning={loading}>
          {/* Metrics Row */}
          <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Assets"
                  value={report?.totalAssetsCount || 0}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Active Assets"
                  value={report?.activeAssetsCount || 0}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="In Repair"
                  value={report?.maintenanceAssetsCount || 0}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Total Investment Cost"
                  value={report?.totalFinancialCost || 0}
                  prefix="$"
                  valueStyle={{ color: '#eb2f96' }}
                  precision={2}
                />
              </Card>
            </Col>
          </Row>

          {/* Assets Table */}
          <Card>
            <div className="table-header">
              <h2>Asset Inventory</h2>
              <Button type="primary" onClick={() => console.log('Create new')}>
                Add New Asset
              </Button>
            </div>
            <Table
              dataSource={assets}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 800 }}
            />
          </Card>
        </Spin>
      </Content>
    </Layout>
  )
}
