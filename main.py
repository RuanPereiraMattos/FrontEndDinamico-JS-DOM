import random
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from palavras import PALAVRAS

app = FastAPI(
    title="API Jogo da Forca - Português Brasil",
    swagger_ui_parameters={"defaultModelsExpandDepth": -1})

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
)


@app.get("/", include_in_schema=False)
async def index():
    return FileResponse("index.html")


@app.get("/forca/aleatoria", tags=["Jogo da Forca"])
async def palavra_aleatoria():
    palavra = random.choice(PALAVRAS)
    return {"palavra": palavra, "tamanho": len(palavra)}
