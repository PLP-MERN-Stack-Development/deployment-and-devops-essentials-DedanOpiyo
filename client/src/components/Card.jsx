// components/Card.jsx
export default function Card({ children, className = "" }) {
  return (
    <div
      className={
        "bg-white dark-:bg-gray-800 shadow rounded-lg p-6 " + className
      }
    >
      {children}
    </div>
  );
}
