import toast from "react-hot-toast";
import axios from "axios";
import { useState, useEffect } from "react";
import { useWeb3Context } from "../contexts/useWeb3Context";
import { ImageUp } from "lucide-react";


const UploadImage = ({reloadEffects}) => {
    const [file, setFile] = useState(null);
    const { web3State } = useWeb3Context();
    const { selectedAccount, contractInstance } = web3State;
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!contractInstance || !selectedAccount) {
            toast.error("Please connect your wallet first.");
        }
    }, [contractInstance, selectedAccount]);

    const uploadImageHash = async (ipfsHash) => {
        if (!contractInstance) {
            toast.error("Contract instance not found. Please connect your wallet.");
            return;
        }

        try {
            if (!selectedAccount) {
                toast.error("Please connect your wallet.");
                return;
            }

            //const tx = await contractInstance.uploadFile(selectedAccount, ipfsHash);
            await toast.promise(contractInstance.uploadFile(selectedAccount, ipfsHash), {
                loading: "Transaction pending...",
                success: "Transaction successful!",
                error: "Transaction failed.",
            });
        } catch (error) {
            console.error("Transaction Error:", error);
            toast.error("Transaction failed");
        }
    };

    const handleImageUpload = async () => {
        if (!file) {
            toast.error("Please select a file to upload.");
            return;
        }

        if (!contractInstance || !selectedAccount) {
            toast.error("Please connect your wallet first.");
            return;
        }

        try {

            setLoading(true)

            const formData = new FormData();
            formData.append("file", file);

            const url = "http://localhost:3000/api/uploadImage";
            const token = localStorage.getItem("token")

            const config={
                headers:{
                    "x-access-token":token
                }
            }

            console.log("Uploading file...");

            const res = await axios.post(url, formData, config);


            if (res.status === 200) {
                toast.success("Image uploaded successfully!");

                const ipfsHash = res.data.ipfsHash;

                await uploadImageHash(ipfsHash);
                setLoading(false)
                reloadEffects()
            } else {
                toast.error("Image upload failed.");
            }
        } catch (error) {
            console.error("Full upload error:", error);
            
            if (error.response) {
                toast.error(`Upload failed: ${error.response.data.message || 'Server error'}`);
            } else if (error.request) {
                toast.error("No response from server. Please check your connection.");
            } else {
                toast.error(`Upload failed: ${error.message}`);
            }
        } finally{
            setLoading(false)
        }
    };

    return ( 
        <div className="h-full w-screen flex flex-col justify-center items-center gap-6">
        <p className="font-semibold md:text-[24px]">
          Upload file with Web3s Security
        </p>
        <div className="w-full flex justify-center items-center">
          <input
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-[200px] md:w-[210px]"
          />
        </div>
        {file ? (
          <button
            onClick={handleImageUpload}
            disabled={loading}
            className="border-sky-400 border-dotted p-2 border-2 rounded-md flex flex-col justify-center items-center hover:bg-sky-200"
          >
            <ImageUp />
            {loading ? "Uploading..." : "Upload"}
          </button>
        ) : (
          <p className="text-[20px] font-semibold text-red-500">
            Choose a File To Upload
          </p>
        )}
    
        <br />
      </div>);
};

export default UploadImage;
