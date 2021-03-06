import { useEffect, useRef, useState } from "react";
import UploadFilesService from "../../services/FilesUploadService";

const FilesUpload = () => {

    const [fiels, setFiels] = useState({
        selectedFiles: [],
        progressInfos: [],
        message: [],
        fileInfos: [],
        error: [],
    });
    const { selectedFiles, progressInfos, message, fileInfos, error } = fiels;
    const progressInfosRef = useRef(null);

    console.log(fiels);

    const selectFiles = (e) => {
        
        setFiels( prev => ({
            ...prev,
            selectedFiles: [...prev.selectedFiles, ...e.target.files],
            progressInfos: [...prev.progressInfos, { val: [] }]
        }));
    };
    
    const uploadFiles = async () => {
        
        const _progressInfos = selectedFiles.map(selectedFile => ({ percentage: 0, fileName: selectedFile.name }));
        progressInfosRef.current = {
            val: _progressInfos,
        };

        const uploadPromises = selectedFiles.map((selectedFile, idx) => upload(selectedFile, idx));
        await Promise.all(uploadPromises)
            .then((res) => UploadFilesService.getFiles())
            .then((fiels) => {
                setFiels(prev => ({
                    ...prev,
                    fileInfos: fiels.data,
                }))
            });
    };

    const upload = (selectedFile, idx) => {

        let _progressInfos = [...progressInfosRef.current.val];

        return UploadFilesService.upload(selectedFile, (e) => {
            _progressInfos[idx].percentage = Math.round((100 * e.loaded) / e.total);
            setFiels(prev => ({
                ...prev,
                progressInfos: _progressInfos,
            }));
        })
        .then((res) => {
            setFiels(prev => ({
                ...prev,
                message: [...message, `Uploaded the file successfully: ${selectedFile.name}`],
            }));
        })
        .catch((err) => {
            _progressInfos[idx].percentage = 0;
            setFiels(prev => ({
                ...prev,
                progressInfos: _progressInfos,
                message: [...message, `Could not upload the file: ${selectedFile.name}`],
                error: [...error, err.response.data],
            }));
        });
    };
    
    useEffect(() => {

        UploadFilesService.getFiles()
            .then((response) => {
                setFiels(prev => ({
                    ...prev,
                    fileInfos: response.data,
                }));
            });

    }, []);

    return ( 
        <div>
            {progressInfos &&
                progressInfos.map((progressInfo, index) => (
                    <div className="mb-2" key={index}>
                        <span>{progressInfo.fileName}</span>
                        <div className="progress">
                            <div
                                className="progress-bar progress-bar-info"
                                role="progressbar"
                                aria-valuenow={progressInfo.percentage}
                                aria-valuemin="0"
                                aria-valuemax="100"
                                style={{ width: progressInfo.percentage + "%" }}
                            >
                                {progressInfo.percentage}%
                            </div>
                        </div>
                    </div>
                ))}
            <div className="row my-3">
                <div className="col-8">
                    <label className="btn btn-default p-0">
                        <input type="file" multiple onChange={selectFiles} />
                    </label>
                </div>
                <div className="col-4">
                    <button
                        className="btn btn-success btn-sm"
                        disabled={!selectedFiles}
                        onClick={uploadFiles}
                    >
                        Upload
                    </button>
                </div>
                {selectedFiles &&
                 <div className="row my-3">
                    <ul>
                        {selectedFiles.map( (item, i) => (<h8 key={i}>{item.name}<br/></h8>) )}
                    </ul>
                </div>
                }
            </div>
            {message.length > 0 && (
                <div className="alert alert-secondary" role="alert">
                    <ul>
                        {message.map((item, i) => {
                            return <li key={i}>{item}</li>;
                        })}
                    </ul>
                </div>
            )}
            <div className="card">
                <div className="card-header">List of Files</div>
                <ul className="list-group list-group-flush">
                    {fileInfos &&
                        fileInfos.map((file, index) => (
                            <li className="list-group-item" key={index}>
                                <a href={file.url}>{file.name}</a>
                            </li>
                        ))}
                </ul>
            </div>
        </div>
     );
}
 
export default FilesUpload;