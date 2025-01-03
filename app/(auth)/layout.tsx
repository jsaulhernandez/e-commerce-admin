import { GenericLayoutProps } from "@/data/types";

const AuthLayout = ({ children }: GenericLayoutProps) => {
  return (
    <div className="flex items-center justify-center h-full">{children}</div>
  );
};

export default AuthLayout;
