const EmptyState = ({ message, icon = '📦', action }) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="text-6xl mb-4">{icon}</div>
            <h3 className="text-2xl font-semibold text-navy-500 mb-2">
                {message || 'No items found'}
            </h3>
            {action && (
                <button onClick={action.onClick} className="btn-primary mt-4">
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
