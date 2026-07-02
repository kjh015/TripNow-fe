import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getPost } from '../../api/postSearchApi';
import { updatePost, deletePost } from '../../api/postApi';
import useAlert from '../../hooks/useAlert';
import PostForm from '../components/PostForm';

const PostEditPage = () => {
    const [searchParams] = useSearchParams();
    const no = searchParams.get('no');
    const navigate = useNavigate();
    const [post, setPost] = useState({
        no: '',
        title: '',
        content: '',
        memberNickname: '',
        travelPlace: '',
        address: '',
        category: '',
        region: '',
        imagePaths: []
    });
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const { alert, showAlert } = useAlert(500);

    const viewBoard = async () => {
        try {
            const { data } = await getPost(no);
            const post = data.result ?? data;
            setPost(post);
            setExistingImages(post.imagePaths || []);
            setNewImages([]);
            setImagePreviews(post.imagePaths || []);
        } catch {
            showAlert("게시글을 불러오지 못했습니다.", "danger");
        }
    };

    const removeBoard = async () => {
        try {
            await deletePost(no);
            showAlert("삭제 성공", "success");
            setTimeout(() => navigate('/post/list'), 500);
        } catch {
            showAlert("삭제 실패", "danger");
        }
    };

    useEffect(() => {
        viewBoard();
        const nickname = localStorage.getItem("nickname");
        if (nickname == null) {
            showAlert("로그인이 필요합니다.", "danger");
            setTimeout(() => navigate(-1), 500);
            return;
        }
        setPost(prev => ({ ...prev, memberNickname: nickname }));
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

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const allFilenames = new Set([
            ...existingImages.map(path => path.split('/').pop()),
            ...newImages.map(file => file.name),
        ]);
        const newFiles = files.filter(f => !allFilenames.has(f.name));
        setNewImages(prev => [...prev, ...newFiles]);
        setImagePreviews(prev => [...prev, ...newFiles.map(file => URL.createObjectURL(file))]);
    };

    const handleExistingImageRemove = (idx) => {
        setExistingImages(prev => prev.filter((_, i) => i !== idx));
        setImagePreviews(prev => prev.filter((_, i) => i !== idx));
    };

    const handleNewImageRemove = (idx) => {
        setNewImages(prev => prev.filter((_, i) => i !== idx));
        setImagePreviews(prev => {
            const existLen = existingImages.length;
            return prev.filter((_, i) => i !== (existLen + idx));
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const postBlob = new Blob([JSON.stringify(post)], { type: "application/json" });
        formData.append('board', postBlob);
        formData.append('existingImages', JSON.stringify(existingImages));
        newImages.forEach(file => formData.append('images', file));
        try {
            await updatePost(no, formData);
            showAlert("글 수정이 완료되었습니다.", "success");
            setTimeout(() => navigate('/post/list'), 500);
        } catch {
            showAlert("글 수정에 실패하였습니다.", "danger");
        }
    };

    const imageSection = (
        <div className="mb-4">
            <label className="form-label fw-semibold">
                사진 첨부 <span className="text-secondary" style={{ fontSize: "0.95em" }}>(여러 장 첨부 가능)</span>
            </label>
            <div className="bg-light rounded-4 p-3 px-4 border">
                <input type="file" accept="image/*" multiple onChange={handleImageChange} className="form-control mb-3" />
                <div className="d-flex flex-wrap gap-3">
                    {existingImages.map((src, idx) => (
                        <div key={`exist-${idx}`} style={{ position: 'relative' }}>
                            <img
                                src={src.startsWith('/images/') ? `${process.env.REACT_APP_IMAGE_BASE_URL}${src}` : src}
                                alt={`preview-exist-${idx}`}
                                style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 14, border: '1px solid #eee', boxShadow: "0 2px 6px rgba(0,0,0,0.06)" }}
                            />
                            <button
                                type="button" className="btn btn-danger btn-sm"
                                style={{ position: 'absolute', top: 5, right: 5, borderRadius: '50%', padding: '2px 7px', fontSize: "1.05rem" }}
                                onClick={() => handleExistingImageRemove(idx)}
                            >×</button>
                        </div>
                    ))}
                    {newImages.map((file, idx) => (
                        <div key={`new-${idx}`} style={{ position: 'relative' }}>
                            <img
                                src={imagePreviews[existingImages.length + idx]}
                                alt={`preview-new-${idx}`}
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
            onDelete={removeBoard}
            imageSection={imageSection}
            alert={alert}
        />
    );
};

export default PostEditPage;
