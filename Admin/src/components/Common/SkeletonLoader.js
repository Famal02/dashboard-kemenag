import React from 'react';
import { Card, CardBody } from 'reactstrap';

const SkeletonLoader = ({ type = "text", count = 1, height, width, style = {} }) => {

    // Helper to resolve CSS class
    const getClassName = () => {
        switch (type) {
            case "map": return "skeleton skeleton-map";
            case "text": return "skeleton skeleton-text";
            case "title": return "skeleton skeleton-title";
            case "circle": return "skeleton skeleton-circle";
            case "chart": return "skeleton skeleton-chart";
            case "rect": return "skeleton skeleton-rect";
            default: return `skeleton skeleton-${type}`;
        }
    };

    if (type === "table") {
        return (
            <Card className="kemenag-card shadow-sm border-0">
                <CardBody>
                    <div className="d-flex justify-content-between mb-4">
                        <div className="skeleton skeleton-title" style={{ width: '40%', height: '24px' }}></div>
                        <div className="skeleton skeleton-rect" style={{ width: '20%', height: '32px' }}></div>
                    </div>

                    {/* Table Header Skeleton */}
                    <div className="d-flex gap-3 py-3 border-bottom bg-light mb-2">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="skeleton" style={{ width: '20%', height: '20px' }}></div>
                        ))}
                    </div>

                    {/* Table Rows */}
                    {[...Array(count || 5)].map((_, i) => (
                        <div key={i} className="d-flex gap-3 py-3 border-bottom align-items-center">
                            <div className="skeleton" style={{ width: '5%', height: '20px' }}></div>
                            <div className="skeleton" style={{ width: '25%', height: '20px' }}></div>
                            <div className="skeleton" style={{ width: '20%', height: '20px' }}></div>
                            <div className="skeleton" style={{ width: '15%', height: '20px' }}></div>
                            <div className="skeleton" style={{ width: '35%', height: '32px', borderRadius: '20px' }}></div>
                        </div>
                    ))}
                </CardBody>
            </Card>
        )
    }

    if (type === "table-rows") {
        return (
            <div className="w-100">
                {/* Simpel Header */}
                <div className="d-flex gap-3 py-3 border-bottom bg-light mb-2 opacity-50">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="skeleton" style={{ width: '15%', height: '20px' }}></div>
                    ))}
                </div>
                {[...Array(count || 5)].map((_, i) => (
                    <div key={i} className="d-flex gap-3 py-3 border-bottom align-items-center">
                        <div className="skeleton" style={{ width: '5%', height: '20px' }}></div>
                        <div className="skeleton" style={{ width: '20%', height: '20px' }}></div>
                        <div className="skeleton" style={{ width: '15%', height: '20px' }}></div>
                        <div className="skeleton" style={{ width: '15%', height: '20px' }}></div>
                        <div className="skeleton" style={{ width: '25%', height: '20px' }}></div>
                        <div className="skeleton" style={{ width: '15%', height: '32px', borderRadius: '20px' }}></div>
                    </div>
                ))}
            </div>
        )
    }

    if (type === "card") {
        return (
            <Card className="kemenag-card border-0 shadow-sm" style={{ height: height || '100%' }}>
                <CardBody>
                    <div className="skeleton skeleton-title mb-4" style={{ width: '50%' }}></div>
                    <div className="d-flex align-items-center gap-3">
                        <div className="skeleton skeleton-circle" style={{ width: 50, height: 50 }}></div>
                        <div className="flex-grow-1">
                            <div className="skeleton skeleton-text mb-2" style={{ width: '80%' }}></div>
                            <div className="skeleton skeleton-text" style={{ width: '60%' }}></div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        )
    }

    return (
        <div className="w-100" style={style}>
            {[...Array(count)].map((_, i) => (
                <div
                    key={i}
                    className={getClassName()}
                    style={{ height, width, marginBottom: count > 1 ? '10px' : 0 }}
                />
            ))}
        </div>
    );
};

export default SkeletonLoader;
