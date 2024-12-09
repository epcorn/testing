/* eslint-disable react/prop-types */
import { FileInput, Label } from 'flowbite-react';
import { useState } from 'react';
import { toast } from "react-toastify";
import Loading from './Loading';




// eslint-disable-next-line no-unused-vars
function ImagesInfo({ formData, setFormData }) {
    const [loading, setLoading] = useState(false);

    async function handleFile(e) {
        const { files, name } = e.target;
        try {
            setLoading(true);
            const images = Array.from(files);
            const form = new FormData();
            images.forEach((image) => {
                form.append("images", image);
            });

            const res = await fetch("/api/v1/upload", {
                method: "POST",
                body: form,
            });
            if (!res.ok) {
                const errorData = await res.json();
                return toast.error(`${errorData.message}`, { autoClose: 1000 });
            }
            const data = await res.json();

            setFormData({
                ...formData,
                images: {
                    ...formData.images,
                    [name]: data.link
                }
            });
            toast.success(data.message);

        } catch (error) {
            console.log(error);
            toast.error("Document Upload Failed", { autoClose: 1000 });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex items-center justify-center mt-2 gap-2'>
            {loading && <Loading />}
            <div>
                <div className="mb-5 block">
                    <div>
                        <Label htmlFor="passport" value="Passport Size photo" />
                    </div>
                    <FileInput id="passport" name='passport' onChange={(e) => handleFile(e)} />
                </div>
                <div className="mb-5 block">
                    <div>
                        <Label htmlFor="aadhar" value="Aadhar Card image" />
                    </div>
                    <FileInput id="aadhar" name='aadhar' onChange={(e) => handleFile(e)} />
                </div>
                <div className="mb-5 block">
                    <div>
                        <Label htmlFor="driving" value="Driving Licence image" />
                    </div>
                    <FileInput id="driving" name='driving' onChange={(e) => handleFile(e)} />
                </div>
            </div>
            <div>
                <div className="mb-5 block">
                    <div>
                        <Label htmlFor="electricity" value="Electricity bill image" />
                    </div>
                    <FileInput id="electricity" name='electricity' onChange={(e) => handleFile(e)} />
                </div>
                <div className="mb-5 block">
                    <div>
                        <Label htmlFor="plc" value="PLC image" />
                    </div>
                    <FileInput id="plc" name='plc' onChange={(e) => handleFile(e)} />
                </div>
                <div className="mb-5 block">
                    <div>
                        <Label htmlFor="insurance" value="Insurance image" />
                    </div>
                    <FileInput id="insurance" name='insurance' onChange={(e) => handleFile(e)} />
                </div>
            </div>
        </div>
    );
}

export default ImagesInfo;