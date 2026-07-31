from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.api.deps import get_db, get_current_user
from app.features.auth.models import User
from app.features.chat.models import ChatMessage
from app.features.chat.schemas import ChatMessageCreate, ChatMessageOut, ChatHistoryResponse
from app.integrations.llm import analyze_text_with_llm  # We'll use this or a generic LLM method

router = APIRouter()

@router.post("", response_model=ChatMessageOut)
def send_chat_message(
    msg: ChatMessageCreate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    # 1. Save user message
    user_msg = ChatMessage(
        user_id=current_user.id,
        role="user",
        content=msg.content
    )
    db.add(user_msg)
    
    # 2. Get LLM response
    # For now, we can just use our existing analyze_text_with_llm function,
    # or a generic one if you prefer. Let's do a simple AI response for now.
    ai_response_text = f"AI Assistant analyzing: {msg.content}. Based on telemetry, this looks interesting."
    try:
        res = analyze_text_with_llm(msg.content)
        if res and "llm_reason" in res:
            ai_response_text = res["llm_reason"]
    except Exception:
        pass
        
    ai_msg = ChatMessage(
        user_id=current_user.id,
        role="assistant",
        content=ai_response_text
    )
    db.add(ai_msg)
    db.commit()
    db.refresh(ai_msg)
    
    return ai_msg

@router.get("/history", response_model=ChatHistoryResponse)
def get_chat_history(
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    messages = db.query(ChatMessage).filter(ChatMessage.user_id == current_user.id).order_by(ChatMessage.created_at.asc()).all()
    return {"messages": messages}
