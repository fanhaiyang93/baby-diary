/**
 * 照片上传和处理功能
 * 支持本地照片压缩、优化和预览
 */

class PhotoUploader {
    constructor() {
        this.maxWidth = 1200;
        this.maxHeight = 800;
        this.quality = 0.8;
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.supportedFormats = ['image/jpeg', 'image/png', 'image/webp'];
        this.processedPhotos = [];
    }

    /**
     * 初始化上传功能
     */
    init() {
        this.setupEventListeners();
        console.log('照片上传功能已初始化 📸');
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        const uploadArea = document.getElementById('upload-area');
        const photoInput = document.getElementById('photo-input');

        if (!uploadArea || !photoInput) {
            console.warn('上传区域或文件输入框未找到');
            return;
        }

        // 拖拽事件
        uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
        uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
        uploadArea.addEventListener('drop', this.handleDrop.bind(this));

        // 文件选择事件
        photoInput.addEventListener('change', this.handleFileSelect.bind(this));
    }

    /**
     * 处理拖拽悬停
     */
    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('dragover');
    }

    /**
     * 处理拖拽离开
     */
    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('dragover');
    }

    /**
     * 处理文件拖拽放置
     */
    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('dragover');

        const files = Array.from(e.dataTransfer.files).filter(file => 
            this.supportedFormats.includes(file.type)
        );

        if (files.length > 0) {
            this.processFiles(files);
        } else {
            this.showMessage('请选择有效的图片文件（JPEG、PNG、WebP）', 'warning');
        }
    }

    /**
     * 处理文件选择
     */
    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.processFiles(files);
    }

    /**
     * 处理文件列表
     */
    async processFiles(files) {
        const validFiles = files.filter(file => {
            if (!this.supportedFormats.includes(file.type)) {
                this.showMessage(`不支持的文件格式: ${file.name}`, 'warning');
                return false;
            }
            if (file.size > this.maxFileSize) {
                this.showMessage(`文件过大: ${file.name} (${this.formatFileSize(file.size)})`, 'warning');
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) {
            return;
        }

        this.showMessage(`正在处理 ${validFiles.length} 张照片...`, 'info');
        
        for (const file of validFiles) {
            try {
                const processedPhoto = await this.processPhoto(file);
                this.processedPhotos.push(processedPhoto);
            } catch (error) {
                console.error('处理照片失败:', error);
                this.showMessage(`处理失败: ${file.name}`, 'error');
            }
        }

        this.updatePreview();
        this.showPreviewArea();
    }

    /**
     * 处理单张照片
     */
    async processPhoto(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    try {
                        const canvas = this.resizeImage(img);
                        canvas.toBlob((blob) => {
                            const processedFile = new File([blob], this.generateFileName(file.name), {
                                type: 'image/jpeg',
                                lastModified: Date.now()
                            });
                            
                            resolve({
                                original: file,
                                processed: processedFile,
                                preview: canvas.toDataURL('image/jpeg', 0.7),
                                dimensions: {
                                    original: { width: img.width, height: img.height },
                                    processed: { width: canvas.width, height: canvas.height }
                                },
                                compression: ((file.size - processedFile.size) / file.size * 100).toFixed(1)
                            });
                        }, 'image/jpeg', this.quality);
                    } catch (error) {
                        reject(error);
                    }
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * 调整图片尺寸
     */
    resizeImage(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 计算新尺寸
        let { width, height } = this.calculateNewDimensions(img.width, img.height);
        
        canvas.width = width;
        canvas.height = height;

        // 绘制图片
        ctx.drawImage(img, 0, 0, width, height);
        
        return canvas;
    }

    /**
     * 计算新的图片尺寸
     */
    calculateNewDimensions(originalWidth, originalHeight) {
        let width = originalWidth;
        let height = originalHeight;

        // 如果图片尺寸超过最大限制，按比例缩放
        if (width > this.maxWidth || height > this.maxHeight) {
            const aspectRatio = width / height;
            
            if (width > height) {
                width = this.maxWidth;
                height = width / aspectRatio;
            } else {
                height = this.maxHeight;
                width = height * aspectRatio;
            }
        }

        return { width: Math.round(width), height: Math.round(height) };
    }

    /**
     * 生成新的文件名
     */
    generateFileName(originalName) {
        const timestamp = new Date().toISOString().slice(0, 10);
        const baseName = originalName.replace(/\.[^/.]+$/, '');
        return `${baseName}-optimized-${timestamp}.jpg`;
    }

    /**
     * 更新预览区域
     */
    updatePreview() {
        const previewGrid = document.getElementById('preview-grid');
        if (!previewGrid) return;

        previewGrid.innerHTML = '';

        this.processedPhotos.forEach((photo, index) => {
            const previewItem = this.createPreviewItem(photo, index);
            previewGrid.appendChild(previewItem);
        });
    }

    /**
     * 创建预览项
     */
    createPreviewItem(photo, index) {
        const item = document.createElement('div');
        item.className = 'preview-item';
        item.innerHTML = `
            <div class="preview-image-container">
                <img src="${photo.preview}" alt="${photo.processed.name}" class="preview-image">
                <button class="preview-remove" onclick="photoUploader.removePhoto(${index})" title="删除">
                    <span>×</span>
                </button>
            </div>
            <div class="preview-info">
                <div class="preview-name" title="${photo.processed.name}">${photo.processed.name}</div>
                <div class="preview-details">
                    <div class="preview-size">
                        <span class="size-label">原始:</span> ${this.formatFileSize(photo.original.size)}
                    </div>
                    <div class="preview-size">
                        <span class="size-label">优化:</span> ${this.formatFileSize(photo.processed.size)}
                    </div>
                    <div class="preview-compression">
                        <span class="compression-label">压缩:</span> ${photo.compression}%
                    </div>
                </div>
                <div class="preview-dimensions">
                    <div class="dimension-item">
                        <span class="dim-label">原始:</span> ${photo.dimensions.original.width}×${photo.dimensions.original.height}
                    </div>
                    <div class="dimension-item">
                        <span class="dim-label">优化:</span> ${photo.dimensions.processed.width}×${photo.dimensions.processed.height}
                    </div>
                </div>
            </div>
        `;
        return item;
    }

    /**
     * 删除照片
     */
    removePhoto(index) {
        this.processedPhotos.splice(index, 1);
        this.updatePreview();
        
        if (this.processedPhotos.length === 0) {
            this.hidePreviewArea();
        }
    }

    /**
     * 显示预览区域
     */
    showPreviewArea() {
        const previewArea = document.getElementById('preview-area');
        if (previewArea) {
            previewArea.style.display = 'block';
        }
    }

    /**
     * 隐藏预览区域
     */
    hidePreviewArea() {
        const previewArea = document.getElementById('preview-area');
        if (previewArea) {
            previewArea.style.display = 'none';
        }
    }

    /**
     * 下载所有处理后的照片
     */
    downloadAllPhotos() {
        if (this.processedPhotos.length === 0) {
            this.showMessage('没有可下载的照片', 'warning');
            return;
        }

        this.processedPhotos.forEach((photo, index) => {
            setTimeout(() => {
                this.downloadPhoto(photo.processed, photo.processed.name);
            }, index * 100); // 延迟下载避免浏览器阻止
        });

        this.showMessage(`开始下载 ${this.processedPhotos.length} 张优化后的照片`, 'success');
    }

    /**
     * 下载单张照片
     */
    downloadPhoto(file, filename) {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * 清空所有照片
     */
    clearAllPhotos() {
        this.processedPhotos = [];
        this.updatePreview();
        this.hidePreviewArea();
        
        // 清空文件输入框
        const photoInput = document.getElementById('photo-input');
        if (photoInput) {
            photoInput.value = '';
        }
        
        this.showMessage('已清空所有照片', 'info');
    }

    /**
     * 生成使用指南
     */
    generateUsageGuide() {
        if (this.processedPhotos.length === 0) {
            this.showMessage('请先处理一些照片', 'warning');
            return;
        }

        let guide = '# 照片使用指南\n\n';
        guide += '## 文件列表\n\n';
        
        this.processedPhotos.forEach((photo, index) => {
            guide += `${index + 1}. **${photo.processed.name}**\n`;
            guide += `   - 原始尺寸: ${photo.dimensions.original.width}×${photo.dimensions.original.height}\n`;
            guide += `   - 优化尺寸: ${photo.dimensions.processed.width}×${photo.dimensions.processed.height}\n`;
            guide += `   - 文件大小: ${this.formatFileSize(photo.processed.size)}\n`;
            guide += `   - 压缩率: ${photo.compression}%\n\n`;
        });
        
        guide += '## 使用步骤\n\n';
        guide += '1. 将优化后的照片保存到项目的 `assets/images/photos/` 目录\n';
        guide += '2. 在 `photos.html` 页面中添加相应的HTML代码\n';
        guide += '3. 提交更改到GitHub仓库\n\n';
        guide += '## HTML代码示例\n\n';
        guide += '```html\n';
        
        this.processedPhotos.forEach((photo) => {
            const filename = photo.processed.name;
            guide += `<div class="photo-item">\n`;
            guide += `    <img src="/assets/images/photos/${filename}" alt="照片描述">\n`;
            guide += `    <div class="photo-info">\n`;
            guide += `        <h3 class="photo-title">照片标题</h3>\n`;
            guide += `        <p class="photo-description">照片描述</p>\n`;
            guide += `        <div class="photo-meta">\n`;
            guide += `            <span class="photo-date">拍摄日期</span>\n`;
            guide += `            <span class="photo-tags">标签</span>\n`;
            guide += `        </div>\n`;
            guide += `    </div>\n`;
            guide += `</div>\n\n`;
        });
        
        guide += '```\n';
        
        this.downloadTextFile(guide, 'photo-usage-guide.md');
        this.showMessage('使用指南已生成并下载', 'success');
    }

    /**
     * 下载文本文件
     */
    downloadTextFile(content, filename) {
        const blob = new Blob([content], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * 格式化文件大小
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * 显示消息
     */
    showMessage(message, type = 'info') {
        // 创建消息元素
        const messageEl = document.createElement('div');
        messageEl.className = `upload-message upload-message-${type}`;
        messageEl.textContent = message;
        
        // 添加到页面
        const container = document.querySelector('.method-container') || document.body;
        container.appendChild(messageEl);
        
        // 自动移除
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 3000);
    }
}

// 全局实例
let photoUploader;

// 全局函数（供HTML调用）
window.processPhotos = function() {
    if (!photoUploader || photoUploader.processedPhotos.length === 0) {
        alert('请先选择照片');
        return;
    }
    
    photoUploader.downloadAllPhotos();
};

window.clearPhotos = function() {
    if (photoUploader) {
        photoUploader.clearAllPhotos();
    }
};

window.generateGuide = function() {
    if (photoUploader) {
        photoUploader.generateUsageGuide();
    }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    photoUploader = new PhotoUploader();
    photoUploader.init();
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PhotoUploader;
}