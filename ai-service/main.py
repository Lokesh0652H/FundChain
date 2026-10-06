from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from detector import anomaly_engine

app = FastAPI(
    title="FundChain AI Anomaly & Pattern Detection Service",
    description="Statistical & Machine Learning Monitoring Microservice for Public Fund Tracking",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProjectAnalysisRequest(BaseModel):
    project: Dict[str, Any]
    expenses: Optional[List[Dict[str, Any]]] = []
    milestones: Optional[List[Dict[str, Any]]] = []

class BatchAnalysisRequest(BaseModel):
    projects: List[Dict[str, Any]]

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "service": "FundChain AI Monitor",
        "model": "Isolation Forest + Multi-Parameter Financial Disparity",
        "version": "1.0.0"
    }

@app.post("/analyze-project")
def analyze_single_project(data: ProjectAnalysisRequest):
    try:
        result = anomaly_engine.analyze_project(
            project=data.project,
            expenses=data.expenses,
            milestones=data.milestones
        )
        return {
            "success": True,
            "projectId": data.project.get("id"),
            "analysis": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze-batch")
def analyze_batch(data: BatchAnalysisRequest):
    try:
        results = []
        for p in data.projects:
            res = anomaly_engine.analyze_project(project=p)
            results.append({
                "projectId": p.get("id"),
                "title": p.get("title") or p.get("name"),
                "analysis": res
            })
        return {
            "success": True,
            "totalProcessed": len(results),
            "flaggedCount": len([r for r in results if r["analysis"]["isFlagged"]]),
            "results": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
