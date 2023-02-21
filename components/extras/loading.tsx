type LoadingProps = {
  borderColor?: string;
};

export default function Loading({ borderColor }: LoadingProps) {
  return (
    <div
      className={`animate-spin border-b-2 ${
        borderColor && borderColor
      }  border-l-2 inline-block w-5 h-5 border rounded-full`}
      role="status"
    >
      <span className="hidden">Loading...</span>
    </div>
  );
}
