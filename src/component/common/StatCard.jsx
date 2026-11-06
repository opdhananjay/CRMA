const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color = "blue"
}) => {

    const colors = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        orange: "bg-orange-50 text-orange-600",
        purple: "bg-purple-50 text-purple-600",
        red: "bg-red-50 text-red-600"
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl p-5">

            <div className="flex items-center justify-between">

                <div>
                    <p className="text-sm text-gray-500">
                        {title}
                    </p>

                    <h2 className="text-2xl font-bold text-gray-800 mt-2">
                        {value}
                    </h2>

                    {subtitle && (
                        <p className="text-xs text-gray-500 mt-2">
                            {subtitle}
                        </p>
                    )}
                </div>

                {Icon && (
                    <div className={`p-3 rounded-lg ${colors[color]}`}>
                        <Icon size={22} />
                    </div>
                )}

            </div>
        </div>
    );
};

export default StatCard;