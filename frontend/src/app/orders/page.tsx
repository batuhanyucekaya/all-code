"use client"

import React, { useState, useEffect } from "react"
import { Package, Clock, CheckCircle, XCircle, Eye, Star } from "lucide-react"
import Link from "next/link"

interface Order {
  id: string
  date: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  total: number
  items: OrderItem[]
}

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
}

const mockOrders: Order[] = [
  {
    id: "ORD-2024-001",
    date: "2024-08-07",
    status: "delivered",
    total: 1250.50,
    items: [
      {
        id: 1,
        name: "Logitech MK270 Kablosuz Set",
        price: 187.25,
        quantity: 2,
        image: "https://via.placeholder.com/80x80"
      },
      {
        id: 2,
        name: "Samsung 20W PD Şarj Aleti",
        price: 144.78,
        quantity: 1,
        image: "https://via.placeholder.com/80x80"
      }
    ]
  },
  {
    id: "ORD-2024-002",
    date: "2024-08-05",
    status: "shipped",
    total: 2899.90,
    items: [
      {
        id: 3,
        name: "Razer BlackShark V2",
        price: 724.98,
        quantity: 1,
        image: "https://via.placeholder.com/80x80"
      }
    ]
  },
  {
    id: "ORD-2024-003",
    date: "2024-08-03",
    status: "processing",
    total: 450.00,
    items: [
      {
        id: 4,
        name: "Philips SHP2500 Kulaklık",
        price: 119.97,
        quantity: 1,
        image: "https://via.placeholder.com/80x80"
      }
    ]
  }
]

const getStatusInfo = (status: Order["status"]) => {
  switch (status) {
    case "pending":
      return { text: "Beklemede", icon: Clock, color: "text-yellow-600", bgColor: "bg-yellow-100" }
    case "processing":
      return { text: "İşleniyor", icon: Package, color: "text-blue-600", bgColor: "bg-blue-100" }
    case "shipped":
      return { text: "Kargoda", icon: Package, color: "text-purple-600", bgColor: "bg-purple-100" }
    case "delivered":
      return { text: "Teslim Edildi", icon: CheckCircle, color: "text-green-600", bgColor: "bg-green-100" }
    case "cancelled":
      return { text: "İptal Edildi", icon: XCircle, color: "text-red-600", bgColor: "bg-red-100" }
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const filteredOrders = selectedStatus === "all" 
    ? orders 
    : orders.filter(order => order.status === selectedStatus)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Siparişlerim</h1>
          <p className="text-gray-600">Tüm siparişlerinizi buradan takip edebilirsiniz</p>
        </div>

        {/* Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedStatus("all")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Tümü ({orders.length})
            </button>
            <button
              onClick={() => setSelectedStatus("pending")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === "pending"
                  ? "bg-yellow-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Beklemede ({orders.filter(o => o.status === "pending").length})
            </button>
            <button
              onClick={() => setSelectedStatus("processing")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === "processing"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              İşleniyor ({orders.filter(o => o.status === "processing").length})
            </button>
            <button
              onClick={() => setSelectedStatus("shipped")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === "shipped"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Kargoda ({orders.filter(o => o.status === "shipped").length})
            </button>
            <button
              onClick={() => setSelectedStatus("delivered")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === "delivered"
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Teslim Edildi ({orders.filter(o => o.status === "delivered").length})
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz siparişiniz yok</h3>
              <p className="text-gray-600 mb-6">İlk siparişinizi vermek için alışverişe başlayın</p>
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Alışverişe Başla
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusInfo = getStatusInfo(order.status)
              const StatusIcon = statusInfo.icon

              return (
                <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Order Header */}
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                            {statusInfo.text}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Sipariş No: <span className="font-medium">{order.id}</span></p>
                          <p className="text-sm text-gray-600">Tarih: {new Date(order.date).toLocaleDateString('tr-TR')}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">{order.total.toFixed(2)} ₺</p>
                        <p className="text-sm text-gray-600">{order.items.length} ürün</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">Adet: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">{(item.price * item.quantity).toFixed(2)} ₺</p>
                            <p className="text-sm text-gray-600">{item.price.toFixed(2)} ₺ / adet</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Actions */}
                    <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
                      <div className="flex space-x-3">
                        <button className="flex items-center space-x-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Eye className="h-4 w-4" />
                          <span>Detayları Gör</span>
                        </button>
                        {order.status === "delivered" && (
                          <button className="flex items-center space-x-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                            <Star className="h-4 w-4" />
                            <span>Değerlendir</span>
                          </button>
                        )}
                      </div>
                      {order.status === "shipped" && (
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          Kargo Takip
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
