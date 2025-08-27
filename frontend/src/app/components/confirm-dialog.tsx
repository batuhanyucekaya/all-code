"use client"

import React from "react"
import { AlertTriangle } from "lucide-react"

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: "danger" | "warning" | "info"
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Evet",
  cancelText = "İptal",
  type = "danger"
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const getTypeStyles = () => {
    switch (type) {
      case "danger":
        return {
          icon: "text-red-500",
          button: "bg-red-600 hover:bg-red-700 text-white",
          border: "border-red-200"
        }
      case "warning":
        return {
          icon: "text-yellow-500",
          button: "bg-yellow-600 hover:bg-yellow-700 text-white",
          border: "border-yellow-200"
        }
      default:
        return {
          icon: "text-blue-500",
          button: "bg-blue-600 hover:bg-blue-700 text-white",
          border: "border-blue-200"
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className={`relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 border ${styles.border}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center mb-4">
            <AlertTriangle className={`w-6 h-6 mr-3 ${styles.icon}`} />
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          
          {/* Message */}
          <p className="text-gray-600 mb-6">{message}</p>
          
          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`px-4 py-2 rounded-md transition-colors ${styles.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
