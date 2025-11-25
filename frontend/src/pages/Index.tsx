import { useState, useCallback } from "react";
import { Upload, Download, Loader2, Image as ImageIcon, Sparkles, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (jpg, png, webp)",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string);
      setEditedImage(null);
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleRemoveBackground = async () => {
    if (!uploadedFile) {
      toast({
        title: "No image",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("image", uploadedFile);
      formData.append("prompt", "Remove background");

      const response = await fetch("https://remove-bg-assignment.onrender.com/api/edit", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove background");
      }

      const data = await response.json();
      setEditedImage(`data:image/png;base64,${data.imageBase64}`);
      
      toast({
        title: "Success!",
        description: "Background removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove background",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!editedImage) return;

    const link = document.createElement("a");
    link.href = editedImage;
    link.download = "removed-background.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-8 z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 transition-colors duration-300">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">AI-Powered Background Remover</span>
          </div>
          
          <div>
            <h1 className="text-7xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
              BG Remover
            </h1>
            <p className="text-xl md:text-2xl text-blue-200 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100">
              Transform your images instantly with AI-powered background removal
            </p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mt-8 px-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors duration-300">
              <p className="text-2xl font-bold text-cyan-400">⚡ Instant</p>
              <p className="text-sm text-blue-200">Process in seconds</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors duration-300">
              <p className="text-2xl font-bold text-cyan-400">🎯 Precise</p>
              <p className="text-sm text-blue-200">Perfect edge detection</p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors duration-300">
              <p className="text-2xl font-bold text-cyan-400">📥 Free</p>
              <p className="text-sm text-blue-200">50 free calls/month</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Side - Upload Area */}
          <div className="animate-in fade-in slide-in-from-left-4 duration-1000 delay-300">
            {!uploadedImage ? (
              <div 
                className="relative group cursor-pointer h-full min-h-96 rounded-2xl border-2 border-dashed transition-all duration-300 overflow-hidden"
                style={{ 
                  borderColor: isDragging ? "rgba(59, 130, 246, 0.8)" : "rgba(148, 163, 184, 0.3)",
                  backgroundColor: isDragging ? "rgba(59, 130, 246, 0.05)" : "rgba(15, 23, 42, 0.4)"
                }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/10 group-hover:via-blue-500/5 group-hover:to-indigo-500/10 transition-all duration-300"></div>
                
                <div className="relative text-center flex flex-col items-center justify-center h-full p-8">
                  <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                    <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold mb-2 text-white">Upload Image</h3>
                  <p className="text-blue-200 mb-8 text-lg">
                    Drop your image here or click to browse
                  </p>
                  
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileInput}
                  />
                  <label htmlFor="file-upload">
                    <Button asChild className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 px-8 py-6 text-base">
                      <span className="cursor-pointer">
                        <ImageIcon className="w-5 h-5 mr-2 inline" />
                        Choose Image
                      </span>
                    </Button>
                  </label>
                  
                  <p className="text-sm text-blue-300 mt-6 font-medium">
                    JPG • PNG • WEBP (Max 12MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-full shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Original Image</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setUploadedImage(null);
                      setUploadedFile(null);
                      setEditedImage(null);
                    }}
                    className="text-blue-300 border-blue-400/30 hover:bg-blue-500/20 hover:text-blue-200"
                  >
                    Change Image
                  </Button>
                </div>
                <div className="rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4 h-96 border border-white/10">
                  <img
                    src={uploadedImage}
                    alt="Original"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Results or CTA */}
          <div className="animate-in fade-in slide-in-from-right-4 duration-1000 delay-300">
            {editedImage ? (
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-full shadow-2xl">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <h3 className="text-lg font-semibold text-white">Result</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        setUploadedImage(null);
                        setUploadedFile(null);
                        setEditedImage(null);
                      }}
                      variant="outline"
                      size="sm"
                      className="text-blue-300 border-blue-400/30 hover:bg-blue-500/20"
                    >
                      Upload New
                    </Button>
                    <Button
                      onClick={handleDownload}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-green-500/50 transition-all duration-300"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center p-4 h-96 border border-white/10">
                  <img
                    src={editedImage}
                    alt="Result"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            ) : uploadedImage ? (
              <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 backdrop-blur-md border border-blue-400/30 rounded-2xl p-8 h-full flex flex-col items-center justify-center shadow-2xl hover:border-blue-400/50 transition-colors duration-300">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-2xl blur-lg opacity-40"></div>
                  <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold mb-3 text-white text-center">Ready to Remove?</h3>
                <p className="text-blue-200 mb-8 text-center max-w-sm leading-relaxed">
                  Click the button below to instantly remove the background from your image using advanced AI technology.
                </p>
                
                <Button
                  onClick={handleRemoveBackground}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-6 text-lg font-semibold shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Remove Background
                    </>
                  )}
                </Button>
              </div>
            ) : null}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
          <h3 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">Why Choose Our Tool?</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "AI-Powered",
                description: "Advanced machine learning for perfect background removal",
                color: "from-purple-400 to-pink-400"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Process your images in just a few seconds",
                color: "from-yellow-400 to-orange-400"
              },
              {
                icon: Download,
                title: "Easy Download",
                description: "Get your PNG with transparent background instantly",
                color: "from-green-400 to-emerald-400"
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-blue-200">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-blue-300 text-sm">
          <p>🚀 Powered by remove.bg API • 50 free calls per month</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
