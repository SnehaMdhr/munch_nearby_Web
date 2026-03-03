"use client";

import { useEffect, useState } from "react";
import LoginForm from "../_components/LoginForm";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <div>
      <LoginForm
        isModal={true}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        switchToRegister={() => {
          setIsModalOpen(false);
        }}
        switchToResetPassword={() => {
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
