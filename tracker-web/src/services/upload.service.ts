import { apiClient } from './apiClient'
import type { UploadResponse } from '@/types/api.types'

const BASE_URL = '/api'

export const uploadService = {
  /**
   * Upload single file
   */
  async uploadFile(file: File, type: 'logo' | 'document' | 'image' = 'image'): Promise<UploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const response = await apiClient.post<UploadResponse>(
      `${BASE_URL}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },

  /**
   * Upload multiple files
   */
  async uploadFiles(files: File[], type: 'logo' | 'document' | 'image' = 'image'): Promise<UploadResponse[]> {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })
    formData.append('type', type)

    const response = await apiClient.post<UploadResponse[]>(
      `${BASE_URL}/upload/multiple`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return response.data
  },

  /**
   * Delete file
   */
  async deleteFile(fileUrl: string): Promise<void> {
    await apiClient.delete(`${BASE_URL}/upload`, {
      data: { fileUrl },
    })
  },

  /**
   * Get file info
   */
  async getFileInfo(fileUrl: string): Promise<any> {
    const response = await apiClient.get(`${BASE_URL}/upload/info`, {
      params: { fileUrl },
    })
    return response.data
  },
}

