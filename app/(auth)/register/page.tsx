"use client";

import { useEffect, useState } from "react";
import RegisterForm from "../_components/RegisterForm";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <div>
      <RegisterForm
        isModal={true}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        switchToLogin={() => {
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
