const Loading = () => {
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-4">
                <div className="size-10 rounded-full border-4 border-primary-200 border-t-transparent animate-spin" />
                <p className="text-light-400">Loading interview...</p>
            </div>
        </div>
    );
};

export default Loading;
