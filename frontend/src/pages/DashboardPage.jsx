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
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
} from 'antd'
import { LogoutOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import '../styles/DashboardPage.css'

const { Header, Content } = Layout

const CATEGORIES = [
  { label: 'Laptop', value: 'Laptop' },
  { label: 'Server', value: 'Server' },
  { label: 'Monitor', value: 'Monitor' },
  { label: 'Networking', value: 'Networking' },
]

const STATUSES = [
  { label: 'Active', value: 'Active' },
  { label: 'In Repair', value: 'In Repair' },
  { label: 'Retired', value: 'Retired' },
]

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [assets, setAssets] = useState([])
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [editingAsset, setEditingAsset] = useState(null)
  const [submitting, setSubmitting] = useState(false)

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

  const openCreateModal = () => {
    setModalMode('create')
    setEditingAsset(null)
    form.resetFields()
    setModalVisible(true)
  }

  const openEditModal = (asset) => {
    setModalMode('edit')
    setEditingAsset(asset)
    form.setFieldsValue({
      asset_tag: asset.asset_tag,
      name: asset.name,
      category: asset.category,
      status: asset.status,
      location: asset.location,
      value: asset.value,
    })
    setModalVisible(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
    form.resetFields()
    setEditingAsset(null)
  }

  const handleModalSubmit = async (values) => {
    setSubmitting(true)

    try {
      if (modalMode === 'create') {
        await api.post('/assets', values)
        message.success('Asset created successfully')
      } else {
        await api.put(`/assets/${editingAsset.id}`, values)
        message.success('Asset updated successfully')
      }

      handleModalClose()
      await fetchData()
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Operation failed'
      message.error(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/assets/${id}`)
      message.success('Asset deleted successfully')
      await fetchData()
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete asset'
      message.error(errorMsg)
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
            onClick={() => openEditModal(record)}
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
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openCreateModal}
              >
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

      {/* Asset Modal */}
      <Modal
        title={modalMode === 'create' ? 'Create New Asset' : 'Edit Asset'}
        open={modalVisible}
        onCancel={handleModalClose}
        onOk={() => form.submit()}
        confirmLoading={submitting}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="Asset Tag"
            name="asset_tag"
            rules={[
              { required: true, message: 'Asset Tag is required' },
              { min: 3, message: 'Asset Tag must be at least 3 characters' },
            ]}
          >
            <Input
              placeholder="e.g., LLI-LAP-001"
              disabled={modalMode === 'edit'}
            />
          </Form.Item>

          <Form.Item
            label="Asset Name"
            name="name"
            rules={[{ required: true, message: 'Asset Name is required' }]}
          >
            <Input placeholder="e.g., Dell Latitude 5540" />
          </Form.Item>

          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: 'Category is required' }]}
          >
            <Select placeholder="Select a category" options={CATEGORIES} />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Status is required' }]}
          >
            <Select placeholder="Select a status" options={STATUSES} />
          </Form.Item>

          <Form.Item label="Assigned To" name="location">
            <Input placeholder="e.g., John Doe / IT Department" />
          </Form.Item>

          <Form.Item
            label="Cost / Value"
            name="value"
            rules={[{ required: true, message: 'Cost is required' }]}
          >
            <InputNumber
              prefix="$"
              placeholder="0.00"
              min={0}
              step={0.01}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  )
}
