import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPost } from '../../api/postSearchApi';
import { updatePost, deletePost, getPresignedUrl } from '../../api/postApi';
import useAlert from '../../hooks/useAlert';
import PostForm from '../components/PostForm';
import {
    CATEGORY_LABEL_TO_CODE, CATEGORY_CODE_TO_LABEL,
    REGION_LABEL_TO_CODE, REGION_CODE_TO_LABEL,
} from '../../constants/categoryRegion';

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || '';

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

const PostEditPage = () => {
    const [searchParams] = useSearchParams();
    const no = searchParams.get('no');
    const navigate = useNavigate();
    const [post, setPost] = useState({
        title: '',
        content: '',
        travelPlace: '',
        address: '',
        category: '',
        region: '',
    });
    // 기존 이미지: { imageKey, sortOrder }[]
    const [existingImages, setExistingImages] = useState([]);
    const [newImageFiles, setNewImageFiles] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const { alert, showAlert } = useAlert(500);

    const loadPost = async () => {
        try {
            const { data } = await getPost(no);
            const postData = data.result;
            setPost({
                title: postData.title,
                content: postData.content,
                travelPlace: postData.travelPlace,
                address: postData.address,
                category: CATEGORY_CODE_TO_LABEL[postData.category] ?? postData.category,
                region: REGION_CODE_TO_LABEL[postData.region] ?? postData.region,
            });
            setExistingImages(postData.images || []);
        } catch {
            showAlert("게시글을 불러오지 못했습니다.", "danger");
        }
    };

    const removePost = async () => {
        try {
            await deletePost(no);
            showAlert("삭제 성공", "success");
            setTimeout(() => navigate('/post/list'), 500);
        } catch {
            showAlert("삭제 실패", "danger");
        }
    };

    useEffect(() => {
        const nickname = localStorage.getItem("nickname");
        if (!nickname) {
            showAlert("로그인이 필요합니다.", "danger");
            setTimeout(() => navigate(-1), 500);
            return;
        }
        loadPost();
    }, [no]);

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

    const handleNewImageChange = (e) => {
        const files = Array.from(e.target.files);
        const existingNames = new Set(newImageFiles.map(f => f.name));
        const newFiles = files.filter(f => !existingNames.has(f.name));
        setNewImageFiles(prev => [...prev, ...newFiles]);
        setNewImagePreviews(prev => [...prev, ...newFiles.map(file => URL.createObjectURL(file))]);
    };

    const handleExistingImageRemove = (idx) => {
        setExistingImages(prev => prev.filter((_, i) => i !== idx));
    };

    const handleNewImageRemove = (idx) => {
        setNewImageFiles(prev => prev.filter((_, i) => i !== idx));
        setNewImagePreviews(prev => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        try {
            const uploadedImageKeys = await Promise.all(newImageFiles.map(uploadImageToS3));
            // 이미지 정렬 순서는 배열 순서 자체로 전달 (기존 이미지 → 신규 이미지 순)
            const images = [...existingImages.map((img) => img.imageKey), ...uploadedImageKeys];
            await updatePost(no, {
                ...post,
                category: CATEGORY_LABEL_TO_CODE[post.category] ?? post.category,
                region: REGION_LABEL_TO_CODE[post.region] ?? post.region,
                images,
            });
            showAlert("글 수정이 완료되었습니다.", "success");
            setTimeout(() => navigate('/post/list'), 500);
        } catch {
            showAlert("글 수정에 실패하였습니다.", "danger");
        } finally {
            setUploading(false);
        }
    };

    const imageSection = (
        <div className="mb-4">
            <label className="form-label fw-semibold">
                사진 첨부 <span className="text-secondary" style={{ fontSize: "0.95em" }}>(여러 장 첨부 가능)</span>
            </label>
            <div className="bg-light rounded-4 p-3 px-4 border">
                <input type="file" accept="image/*" multiple onChange={handleNewImageChange} className="form-control mb-3" />
                <div className="d-flex flex-wrap gap-3">
                    {existingImages.map((img, idx) => (
                        <div key={`exist-${idx}`} style={{ position: 'relative' }}>
                            <img
                                src={`${IMAGE_BASE_URL}/${img.imageKey}`}
                                alt={`existing-${idx}`}
                                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 14, border: '1px solid #eee', boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}
                            />
                            <button
                                type="button" className="btn btn-danger btn-sm"
                                style={{ position: 'absolute', top: 5, right: 5, borderRadius: '50%', padding: '2px 7px', fontSize: "1.05rem" }}
                                onClick={() => handleExistingImageRemove(idx)}
                            >×</button>
                        </div>
                    ))}
                    {newImagePreviews.map((src, idx) => (
                        <div key={`new-${idx}`} style={{ position: 'relative' }}>
                            <img
                                src={src}
                                alt={`new-${idx}`}
                                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 14, border: '1px solid #eee', boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}
                            />
                            <button
                                type="button" className="btn btn-danger btn-sm"
                                style={{ position: 'absolute', top: 5, right: 5, borderRadius: '50%', padding: '2px 7px', fontSize: "1.05rem" }}
                                onClick={() => handleNewImageRemove(idx)}
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
            mode="edit"
            onChange={handleChange}
            onCategorySelect={handleCategorySelect}
            onRegionChange={handleRegionChange}
            onSubmit={handleSubmit}
            onDelete={removePost}
            imageSection={imageSection}
            alert={alert}
            submitDisabled={uploading}
        />
    );
};

export default PostEditPage;
