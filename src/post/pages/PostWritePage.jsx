import { useNavigate } from 'react-router-dom';
import { createPost, getPresignedUrl } from '../../api/postApi';
import { useState, useEffect } from 'react';
import useAlert from '../../hooks/useAlert';
import PostForm from '../components/PostForm';
import { CATEGORY_LABEL_TO_CODE, REGION_LABEL_TO_CODE } from '../../constants/categoryRegion';
import { trackPostAdd } from '../../analytics/events';

const buildSafeFileName = (originalName) => {
    const ext = originalName.includes('.') ? originalName.split('.').pop().toLowerCase() : 'jpg';
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
};

const uploadImageToS3 = async (file) => {
    const { data } = await getPresignedUrl(buildSafeFileName(file.name), file.type);
    const { url, imageKey } = data.result;
    const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
    });
    if (!res.ok) {
        throw new Error(`이미지 업로드 실패 (status: ${res.status})`);
    }
    return imageKey;
};

const PostWritePage = () => {
    const navigate = useNavigate();
    const [post, setPost] = useState({
        title: '',
        content: '',
        travelPlace: '',
        address: '',
        category: '',
        region: ''
    });
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const { alert, showAlert } = useAlert(500);

    useEffect(() => {
        const nickname = localStorage.getItem("nickname");
        if (!nickname) {
            showAlert("로그인이 필요합니다.", "danger");
            setTimeout(() => navigate(-1), 500);
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setPost(prev => ({ ...prev, [id]: value }));
    };

    const handleCategorySelect = (cat) => {
        setPost(prev => ({ ...prev, category: cat }));
    };

    const handleRegionChange = (regionValue) => {
        setPost(prev => ({ ...prev, region: regionValue }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.filter(f => !images.some(img => img.name === f.name));
        setImages(prev => [...prev, ...newFiles]);
        setImagePreviews(prev => [...prev, ...newFiles.map(file => URL.createObjectURL(file))]);
    };

    const handleImageRemove = (idx) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
        setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!images || images.length === 0) {
            showAlert("사진을 한 장 이상 첨부해 주세요!", "danger");
            return;
        }
        setUploading(true);
        try {
            const uploadedImageKeys = await Promise.all(images.map(uploadImageToS3));
            const category = CATEGORY_LABEL_TO_CODE[post.category] ?? post.category;
            const region = REGION_LABEL_TO_CODE[post.region] ?? post.region;
            const { data } = await createPost({
                ...post,
                category,
                region,
                images: uploadedImageKeys,
            });
            // 생성 응답 result가 { postId } 객체든 id 원시값이든 모두 수용 (없으면 null 전송)
            const result = data?.result;
            trackPostAdd({ postId: typeof result === 'object' ? result?.postId : result, category, region });
            showAlert("글 작성이 완료되었습니다.", "success");
            setTimeout(() => navigate('/post/list'), 500);
        } catch {
            showAlert("글 작성에 실패하였습니다.", "danger");
        } finally {
            setUploading(false);
        }
    };

    const imageSection = (
        <div className="mb-4">
            <label className="form-label fw-semibold">
                사진 첨부 <span className="text-secondary post-image-hint">(필수)</span>
            </label>
            <div className="bg-light rounded-4 p-3 px-4 border">
                <input type="file" accept="image/*" multiple onChange={handleImageChange} className="form-control mb-3" />
                <div className="d-flex flex-wrap gap-3">
                    {imagePreviews.map((src, idx) => (
                        <div key={idx} className="position-relative">
                            <img
                                src={src} alt={`preview-${idx}`}
                                className="post-image-preview"
                            />
                            <button
                                type="button" className="btn btn-danger btn-sm post-image-remove-btn"
                                onClick={() => handleImageRemove(idx)}
                            >×</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <PostForm
            post={post}
            mode="write"
            onChange={handleChange}
            onCategorySelect={handleCategorySelect}
            onRegionChange={handleRegionChange}
            onSubmit={handleSubmit}
            imageSection={imageSection}
            alert={alert}
            submitDisabled={images.length === 0 || uploading}
        />
    );
};

export default PostWritePage;
