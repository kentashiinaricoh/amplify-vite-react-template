import { useEffect, useState } from "react";
import { useAuthenticator } from '@aws-amplify/ui-react';

// --- S3 バケット情報 ---
const bucketName = "amplify-d2oahx73axow03-ma-presetimagesbucketd1b9e5-ugk0jylijtyp-bucket-name";
const region = "us-west-2";

// public フォルダ直下の画像キー一覧
const imageKeys = [
  "public/yukidaruma_01.jpg",
  "public/yukidaruma_02.jpg",
];

type UserProfile = {
  name: string;
  age: number;
  interests: string;
};

function App() {
  const { user, signOut } = useAuthenticator();

  // プロフィール
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [interests, setInterests] = useState("");

  // --- 画像 URL を組み立て ---
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  useEffect(() => {
    if (!user) return;
    const urls = imageKeys.map(
      (key) => `https://${bucketName}.s3.${region}.amazonaws.com/${key}`
    );
    setImageUrls(urls);
  }, [user]);

  // --- 選択画像管理 ---
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const toggleSelect = (url: string) => {
    setSelectedImages(prev =>
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  };

  // --- 開始ボタン押下時の処理 ---
  const handleStart = async () => {
    if (selectedImages.length === 0) {
      alert("まず画像を選択してください");
      return;
    }

    try {
      const response = await fetch("https://xxx.execute-api.us-west-2.amazonaws.com/prod/createStory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: selectedImages,
          userId: user?.username,
          profile,
        }),
      });

      const data = await response.json();
      console.log("生成結果:", data);
      alert("紙芝居生成が開始されました！");
    } catch (error) {
      console.error(error);
      alert("紙芝居の生成に失敗しました");
    }
  };

  // --- プロフィール未登録なら入力フォームを表示 ---
  if (!profile) {
    return (
      <main style={{ padding: "2rem" }}>
        <h1>プロフィール入力</h1>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
          <input
            type="text"
            placeholder="名前"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="年齢"
            value={age}
            onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))}
          />
          <input
            type="text"
            placeholder="興味"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
          <button
            onClick={() => {
              if (!name || !age || !interests) {
                alert("全ての項目を入力してください");
                return;
              }
              setProfile({ name, age: Number(age), interests });
            }}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "16px",
              borderRadius: "6px",
              backgroundColor: "#4CAF50",
              color: "white",
              cursor: "pointer",
            }}
          >
            登録
          </button>
        </div>
      </main>
    );
  }

  // --- プロフィール登録済みの場合のメイン画面 ---
  return (
    <main style={{ padding: "2rem" }}>
      <h1>ようこそ {profile.name} さん</h1>
      <p>年齢: {profile.age}さい</p>
      <p>興味: {profile.interests}</p>

      <hr />

      <h2>候補画像一覧 (S3 public/)</h2>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {imageUrls.length > 0 ? (
          imageUrls.map((url, idx) => {
            const isSelected = selectedImages.includes(url);
            return (
              <img
                key={idx}
                src={url}
                alt={`image-${idx}`}
                width={150}
                style={{
                  borderRadius: "8px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  cursor: "pointer",
                  border: isSelected ? "4px solid blue" : "2px solid transparent",
                }}
                onClick={() => toggleSelect(url)}
              />
            );
          })
        ) : (
          <p>画像がありません</p>
        )}
      </div>

      {/* 選択画像プレビュー */}
      <PaperShow images={selectedImages} />

      {/* 開始ボタン */}
      <button
        onClick={handleStart}
        disabled={selectedImages.length === 0} 
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          fontSize: "16px",
          borderRadius: "6px",
          backgroundColor: selectedImages.length === 0 ? "#ccc" : "#4CAF50",
          color: selectedImages.length === 0 ? "#666" : "white",
          cursor: selectedImages.length === 0 ? "not-allowed" : "pointer",
          border: "none",
        }}
      >
        開始
      </button>

      <hr />
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

// --- 選択画像プレビュー ---
function PaperShow({ images }: { images: string[] }) {
  if (images.length === 0) return <p>選択した画像はありません</p>;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>選択画像プレビュー</h2>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {images.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`selected-${idx}`}
            style={{
              width: 200,
              height: 200,
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
