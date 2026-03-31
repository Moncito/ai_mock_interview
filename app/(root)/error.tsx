"use client";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

const Error = ({ error, reset }: ErrorProps) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
            <h2 className="text-2xl font-bold text-destructive-100">Something went wrong</h2>
            <p className="text-light-400 max-w-md">{error.message || "An unexpected error occurred."}</p>
            <button className="btn-primary" onClick={reset}>
                Try again
            </button>
        </div>
    );
};

export default Error;
