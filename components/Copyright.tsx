'use client';

export default function Copyright() {
  const year = new Date().getFullYear();
  return (
    <p className="mt-2">© {year} TrueDogAge.com</p>
  );
}
