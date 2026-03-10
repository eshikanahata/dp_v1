# """
# Driver Pulse — Dashboard
# """

# import os
# import pandas as pd
# import numpy as np
# import plotly.graph_objects as go
# import streamlit as st

# # ---------------------------------------------------------------------------
# # Page config
# # ---------------------------------------------------------------------------
# st.set_page_config(page_title="Driver Pulse", layout="wide", page_icon="DP", initial_sidebar_state="expanded")

# # ---------------------------------------------------------------------------
# # Colors — restricted palette
# # ---------------------------------------------------------------------------
# BLACK      = "#000000"
# OFF_BLACK  = "#1A1A1A"
# DARK_GRAY  = "#2C2C2C"
# MID_GRAY   = "#545454"
# LIGHT_GRAY = "#9E9E9E"
# WHITE      = "#FFFFFF"
# GREEN      = "#06C167"
# AMBER      = "#F5A623"
# RED        = "#EE0000"

# # ---------------------------------------------------------------------------
# # Paths
# # ---------------------------------------------------------------------------
# SCRIPT_DIR   = os.path.dirname(os.path.abspath(__file__))
# PROJECT_ROOT = os.path.dirname(SCRIPT_DIR) if os.path.basename(SCRIPT_DIR) == "dashboard" else SCRIPT_DIR
# OUTPUTS_DIR  = os.path.join(PROJECT_ROOT, "outputs")
# DATA_DIR     = os.path.join(PROJECT_ROOT, "data")

# # ---------------------------------------------------------------------------
# # CSS
# # ---------------------------------------------------------------------------
# st.markdown("""
# <style>
# @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

# html, body, [class*="css"], .stApp {
#     font-family: 'DM Sans', sans-serif !important;
#     background-color: #000000 !important;
#     color: #FFFFFF !important;
# }

# #MainMenu, footer, header { visibility: hidden; }
# .stDeployButton { display: none !important; }

# .main .block-container { padding-top: 1.2rem; max-width: 1200px; }

# /* Sidebar */
# [data-testid="stSidebar"] {
#     background-color: #1A1A1A !important;
#     border-right: 1px solid #2C2C2C;
# }

# /* Tabs — plain text + underline only */
# .stTabs [data-baseweb="tab-list"] {
#     background: transparent;
#     border-bottom: 1px solid #2C2C2C;
#     gap: 0;
#     padding: 0;
# }
# .stTabs [data-baseweb="tab"] {
#     background: transparent;
#     color: #9E9E9E;
#     border: none;
#     border-bottom: 2px solid transparent;
#     border-radius: 0;
#     font-weight: 500;
#     font-size: 14px;
#     padding: 12px 24px;
#     margin: 0;
# }
# .stTabs [aria-selected="true"] {
#     background: transparent !important;
#     color: #FFFFFF !important;
#     font-weight: 600 !important;
#     border-bottom: 2px solid #FFFFFF !important;
# }

# /* Buttons */
# .stButton > button, .stDownloadButton > button {
#     background-color: #FFFFFF !important;
#     color: #000000 !important;
#     font-weight: 600 !important;
#     border: none !important;
#     border-radius: 6px !important;
#     padding: 10px 20px !important;
#     font-family: 'DM Sans', sans-serif !important;
#     font-size: 14px !important;
#     min-height: 44px !important;
# }
# .stButton > button:hover, .stDownloadButton > button:hover {
#     background-color: #E0E0E0 !important;
# }

# /* Selectbox */
# [data-testid="stSelectbox"] > div > div {
#     background-color: #1A1A1A !important;
#     border: 1px solid #2C2C2C !important;
#     color: #FFFFFF !important;
#     border-radius: 6px !important;
# }
# [data-testid="stSelectbox"] label {
#     color: #9E9E9E !important;
#     font-size: 12px !important;
#     text-transform: uppercase;
#     letter-spacing: 0.8px;
# }

# /* Progress bar */
# .stProgress > div > div > div { background-color: #06C167 !important; }
# .stProgress > div > div { background-color: #2C2C2C !important; }

# /* Headers */
# h1, h2, h3, h4 { font-family: 'DM Sans', sans-serif !important; font-weight: 700 !important; color: #FFFFFF !important; }

# /* Expander */
# [data-testid="stExpander"] { background-color: #1A1A1A; border: 1px solid #2C2C2C; border-radius: 6px; }

# /* DataFrames */
# [data-testid="stDataFrame"] { border: 1px solid #2C2C2C; border-radius: 6px; }

# /* Scrollbar */
# ::-webkit-scrollbar { width: 5px; }
# ::-webkit-scrollbar-track { background: #1A1A1A; }
# ::-webkit-scrollbar-thumb { background: #545454; border-radius: 3px; }
# </style>
# """, unsafe_allow_html=True)

# # ---------------------------------------------------------------------------
# # Helpers
# # ---------------------------------------------------------------------------
# def _card(content: str, pad: str = "24px") -> str:
#     return f'<div style="background:{OFF_BLACK}; border:1px solid {DARK_GRAY}; border-radius:6px; padding:{pad}; margin-bottom:12px;">{content}</div>'


# def _metric(label: str, value: str, sub: str = "", val_color: str = WHITE) -> str:
#     sub_html = f'<div style="font-size:13px; color:{LIGHT_GRAY}; margin-top:4px;">{sub}</div>' if sub else ""
#     return _card(
#         f'<div style="font-size:11px; color:{LIGHT_GRAY}; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">{label}</div>'
#         f'<div style="font-size:30px; font-weight:700; font-family:DM Mono,monospace; color:{val_color}; letter-spacing:-1px; line-height:1;">{value}</div>'
#         f'{sub_html}'
#     )


# def _pill(text: str, bg: str, fg: str = BLACK) -> str:
#     return f'<span style="display:inline-block; background:{bg}; color:{fg}; font-size:12px; font-weight:600; padding:3px 10px; border-radius:4px; letter-spacing:0.3px;">{text}</span>'


# def _divider():
#     st.markdown(f'<div style="border-top:1px solid {DARK_GRAY}; margin:24px 0;"></div>', unsafe_allow_html=True)


# def _footer():
#     st.markdown(
#         f'<div style="margin-top:48px; padding-top:16px; border-top:1px solid {DARK_GRAY}; font-size:12px; color:{MID_GRAY};">'
#         f'Driver Pulse v1.0 &middot; Uber She++ Hackathon &middot; Non-ML &middot; Privacy-safe</div>',
#         unsafe_allow_html=True,
#     )


# # ---------------------------------------------------------------------------
# # Data
# # ---------------------------------------------------------------------------
# @st.cache_data
# def load_outputs():
#     fm = pd.read_csv(os.path.join(OUTPUTS_DIR, "flagged_moments.csv")) if os.path.exists(os.path.join(OUTPUTS_DIR, "flagged_moments.csv")) else pd.DataFrame()
#     ts = pd.read_csv(os.path.join(OUTPUTS_DIR, "trip_summaries.csv")) if os.path.exists(os.path.join(OUTPUTS_DIR, "trip_summaries.csv")) else pd.DataFrame()
#     return fm, ts

# @st.cache_data
# def load_source():
#     e = pd.read_csv(os.path.join(DATA_DIR, "earnings_velocity_log.csv")) if os.path.exists(os.path.join(DATA_DIR, "earnings_velocity_log.csv")) else pd.DataFrame()
#     g = pd.read_csv(os.path.join(DATA_DIR, "driver_goals.csv")) if os.path.exists(os.path.join(DATA_DIR, "driver_goals.csv")) else pd.DataFrame()
#     return e, g

# with st.spinner("Loading..."):
#     moments_df, summaries_df = load_outputs()
#     earnings_df, goals_df = load_source()

# if summaries_df.empty and moments_df.empty:
#     st.error("No output data. Run python main.py first.")
#     st.stop()

# # ---------------------------------------------------------------------------
# # Header
# # ---------------------------------------------------------------------------
# st.markdown(
#     f'<div style="padding:20px 0 16px 0; border-bottom:1px solid {DARK_GRAY}; margin-bottom:28px;">'
#     f'<div style="font-size:20px; font-weight:700; letter-spacing:-0.3px;">Driver Pulse</div>'
#     f'<div style="font-size:13px; color:{LIGHT_GRAY}; margin-top:2px;">Shift analytics</div>'
#     f'</div>',
#     unsafe_allow_html=True,
# )

# # ---------------------------------------------------------------------------
# # Sidebar
# # ---------------------------------------------------------------------------
# all_drivers = sorted(set(
#     list(summaries_df["driver_id"].unique() if "driver_id" in summaries_df.columns else [])
#     + list(moments_df["driver_id"].unique() if "driver_id" in moments_df.columns else [])
# ))
# if not all_drivers:
#     st.warning("No driver data.")
#     st.stop()

# with st.sidebar:
#     st.markdown(
#         f'<div style="font-size:11px; color:{LIGHT_GRAY}; text-transform:uppercase; letter-spacing:1px; margin:20px 0 8px 0;">Driver</div>',
#         unsafe_allow_html=True,
#     )
#     selected_driver = st.selectbox("Driver", all_drivers, label_visibility="collapsed")

#     drv_moments  = moments_df[moments_df["driver_id"] == selected_driver]  if "driver_id" in moments_df.columns  else pd.DataFrame()
#     drv_earnings = earnings_df[earnings_df["driver_id"] == selected_driver] if "driver_id" in earnings_df.columns else pd.DataFrame()
#     drv_goals    = goals_df[goals_df["driver_id"] == selected_driver]       if "driver_id" in goals_df.columns    else pd.DataFrame()

#     sb_current = float(drv_earnings["cumulative_earnings"].iloc[-1]) if (not drv_earnings.empty and "cumulative_earnings" in drv_earnings.columns) else 0.0
#     sb_goal    = float(drv_goals.iloc[0].get("target_earnings", 0))   if not drv_goals.empty else 0.0
#     sb_stress  = len(drv_moments)
#     sb_high    = len(drv_moments[drv_moments["severity"] == "HIGH"]) if "severity" in drv_moments.columns else 0

#     st.markdown(
#         _card(
#             f'<div style="font-size:11px; color:{LIGHT_GRAY}; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px;">Shift summary</div>'
#             f'<div style="font-size:26px; font-weight:700; font-family:DM Mono,monospace; letter-spacing:-1px;">₹{sb_current:,.0f}</div>'
#             f'<div style="font-size:12px; color:{LIGHT_GRAY}; margin-top:2px;">of ₹{sb_goal:,.0f} goal</div>'
#             f'<div style="border-top:1px solid {DARK_GRAY}; margin:14px 0;"></div>'
#             f'<div style="display:flex; gap:20px;">'
#             f'<div><div style="font-size:18px; font-weight:700; font-family:DM Mono,monospace;">{sb_stress}</div><div style="font-size:11px; color:{LIGHT_GRAY};">moments</div></div>'
#             f'<div><div style="font-size:18px; font-weight:700; font-family:DM Mono,monospace; color:{RED if sb_high > 0 else LIGHT_GRAY};">{sb_high}</div><div style="font-size:11px; color:{LIGHT_GRAY};">high</div></div>'
#             f'</div>',
#             pad="16px",
#         ),
#         unsafe_allow_html=True,
#     )

# # ---------------------------------------------------------------------------
# # Precompute
# # ---------------------------------------------------------------------------
# driver_summaries = summaries_df[summaries_df["driver_id"] == selected_driver] if "driver_id" in summaries_df.columns else pd.DataFrame()
# driver_moments  = drv_moments
# driver_earnings = drv_earnings
# driver_goals    = drv_goals

# current_earnings = 0.0; pace_now = 0.0; goal_amount = 0.0; remaining_hours = 0.0
# gap_to_goal = 0.0; required_pace = 0.0; goal_status = "On Track"; pace_trend = ""
# projected_end = 0.0; estimated_finish_hours = None

# if not driver_earnings.empty:
#     if "cumulative_earnings" in driver_earnings.columns:
#         current_earnings = float(driver_earnings["cumulative_earnings"].iloc[-1])
#     if "current_velocity" in driver_earnings.columns:
#         pace_now = float(driver_earnings["current_velocity"].iloc[-1])

# if not driver_goals.empty:
#     g = driver_goals.iloc[0]
#     goal_amount = float(g.get("target_earnings", 0))
#     target_hours = float(g.get("target_hours", 8))
#     current_hrs = float(g.get("current_hours", 0))
#     remaining_hours = max(0, target_hours - current_hrs)
#     gap_to_goal = max(0, goal_amount - current_earnings)
#     required_pace = gap_to_goal / remaining_hours if remaining_hours > 0 else 0.0
#     projected = current_earnings + (pace_now * remaining_hours)
#     projected_end = projected
#     estimated_finish_hours = round(gap_to_goal / pace_now, 2) if pace_now > 0 else None
#     if projected >= goal_amount * 0.95:
#         goal_status = "On Track"
#     elif projected >= goal_amount * 0.80:
#         goal_status = "At Risk"
#     else:
#         goal_status = "Off Track"

#     if "current_velocity" in driver_earnings.columns and len(driver_earnings) >= 3:
#         recent = driver_earnings["current_velocity"].tail(5).values
#         slope = np.polyfit(range(len(recent)), recent, 1)[0]
#         if slope > 0.5:
#             pace_trend = "Improving"
#         elif slope < -0.5:
#             pace_trend = "Declining"

# status_color = {
#     "On Track": GREEN, "At Risk": AMBER, "Off Track": RED,
# }

# # ---------------------------------------------------------------------------
# # Tabs
# # ---------------------------------------------------------------------------
# tab1, tab2, tab3, tab4 = st.tabs(["Shift", "Trips", "Detail", "Export"])

# # === TAB 1 — SHIFT =======================================================
# with tab1:
#     c1, c2, c3, c4 = st.columns(4, gap="medium")
#     with c1:
#         st.markdown(_metric("Earnings", f"₹{current_earnings:,.0f}"), unsafe_allow_html=True)
#     with c2:
#         sub = f'<span style="color:{GREEN if pace_trend=="Improving" else AMBER if pace_trend=="Declining" else LIGHT_GRAY};">{pace_trend}</span>' if pace_trend else ""
#         st.markdown(_metric("Pace", f"₹{pace_now:,.0f}/hr", sub=sub), unsafe_allow_html=True)
#     with c3:
#         st.markdown(_metric("Goal", f"₹{goal_amount:,.0f}", sub=f"₹{gap_to_goal:,.0f} remaining"), unsafe_allow_html=True)
#     with c4:
#         st.markdown(_metric("Time left", f"{remaining_hours:.1f}h"), unsafe_allow_html=True)

#     p1, p2 = st.columns(2, gap="medium")
#     with p1:
#         st.markdown(_metric("Projected earnings", f"₹{projected_end:,.0f}", sub=f"at current pace of ₹{pace_now:,.0f}/hr"), unsafe_allow_html=True)
#     with p2:
#         ef_str = f"{estimated_finish_hours:.1f}h" if estimated_finish_hours is not None else "—"
#         ef_sub = "to reach goal at current pace" if estimated_finish_hours is not None else "earning pace unavailable"
#         st.markdown(_metric("Est. finish", ef_str, sub=ef_sub), unsafe_allow_html=True)

#     # Status bar
#     sc = status_color.get(goal_status, GREEN)
#     pill = _pill(goal_status, sc, BLACK if goal_status != "Off Track" else WHITE)
#     if goal_status == "On Track":
#         note = "Ahead of pace"
#     elif goal_status == "At Risk":
#         note = f"Need ₹{required_pace:,.0f}/hr for the next {remaining_hours:.1f}h"
#     else:
#         note = f"Need ₹{required_pace:,.0f}/hr — consider extending"

#     st.markdown(
#         f'<div style="display:flex; align-items:center; gap:12px; padding:14px 0;">'
#         f'{pill}'
#         f'<span style="font-size:13px; color:{LIGHT_GRAY};">{note}</span>'
#         f'</div>',
#         unsafe_allow_html=True,
#     )

#     # Progress
#     progress = min(1.0, current_earnings / goal_amount) if goal_amount > 0 else 0.0
#     st.progress(progress)
#     st.markdown(f'<div style="font-size:12px; color:{LIGHT_GRAY}; text-align:center; margin-top:-4px;">₹{current_earnings:,.0f} / ₹{goal_amount:,.0f}</div>', unsafe_allow_html=True)

#     _divider()

#     # Earnings chart
#     st.markdown(f'<div style="font-size:11px; color:{LIGHT_GRAY}; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">Earnings over time</div>', unsafe_allow_html=True)

#     if not driver_earnings.empty and "cumulative_earnings" in driver_earnings.columns:
#         ts_col = "timestamp" if "timestamp" in driver_earnings.columns else driver_earnings.columns[0]
#         fig = go.Figure()
#         fig.add_trace(go.Scatter(
#             x=driver_earnings[ts_col], y=driver_earnings["cumulative_earnings"],
#             line=dict(color=GREEN, width=2), mode="lines",
#             hovertemplate="₹%{y:,.0f}<extra></extra>",
#         ))
#         if goal_amount > 0:
#             fig.add_hline(y=goal_amount, line_dash="dot", line_color=MID_GRAY, line_width=1,
#                           annotation_text=f"₹{goal_amount:,.0f}", annotation_font_color=LIGHT_GRAY, annotation_font_size=11)
#         fig.update_layout(
#             paper_bgcolor=OFF_BLACK, plot_bgcolor=OFF_BLACK,
#             font=dict(family="DM Sans", color=LIGHT_GRAY, size=11),
#             xaxis=dict(gridcolor=DARK_GRAY, gridwidth=1, showgrid=True, title="", zeroline=False),
#             yaxis=dict(gridcolor=DARK_GRAY, gridwidth=1, showgrid=True, title="", tickprefix="₹", zeroline=False),
#             margin=dict(l=0, r=0, t=8, b=0), height=200, showlegend=False,
#         )
#         st.plotly_chart(fig, use_container_width=True)
#     else:
#         st.markdown(f'<div style="color:{LIGHT_GRAY}; padding:32px; text-align:center;">No earnings data for this driver.</div>', unsafe_allow_html=True)

#     _divider()

#     # Safety
#     st.markdown(f'<div style="font-size:11px; color:{LIGHT_GRAY}; text-transform:uppercase; letter-spacing:1px; margin-bottom:12px;">Safety</div>', unsafe_allow_html=True)

#     s_total = len(driver_moments)
#     s_high  = len(driver_moments[driver_moments["severity"] == "HIGH"])   if "severity" in driver_moments.columns else 0
#     s_med   = len(driver_moments[driver_moments["severity"] == "MEDIUM"]) if "severity" in driver_moments.columns else 0

#     sc1, sc2, sc3 = st.columns(3, gap="medium")
#     with sc1:
#         st.markdown(_metric("Total moments", str(s_total)), unsafe_allow_html=True)
#     with sc2:
#         st.markdown(_metric("High", str(s_high), val_color=RED if s_high > 0 else LIGHT_GRAY), unsafe_allow_html=True)
#     with sc3:
#         st.markdown(_metric("Medium", str(s_med), val_color=AMBER if s_med > 0 else LIGHT_GRAY), unsafe_allow_html=True)

#     _footer()

# # === TAB 2 — TRIPS ========================================================
# with tab2:
#     if driver_summaries.empty:
#         st.markdown(f'<div style="color:{LIGHT_GRAY}; padding:40px; text-align:center;">No trips for this driver.</div>', unsafe_allow_html=True)
#     else:
#         fc1, fc2, fc3 = st.columns(3, gap="medium")
#         with fc1:
#             fq = st.selectbox("Quality", ["All", "STRESSFUL", "MODERATE", "SMOOTH"], key="fq")
#         with fc2:
#             fs = st.selectbox("Max severity", ["All", "HIGH", "MEDIUM", "LOW", "NONE"], key="fs")
#         with fc3:
#             so = st.selectbox("Sort", ["Newest first", "Highest stress", "Highest fare"], key="so")

#         filtered = driver_summaries.copy()
#         if fq != "All" and "trip_quality_rating" in filtered.columns:
#             filtered = filtered[filtered["trip_quality_rating"] == fq]
#         if fs != "All" and "max_severity" in filtered.columns:
#             filtered = filtered[filtered["max_severity"] == fs]
#         if so == "Newest first" and "date" in filtered.columns:
#             filtered = filtered.sort_values("date", ascending=False)
#         elif so == "Highest stress" and "stress_score" in filtered.columns:
#             filtered = filtered.sort_values("stress_score", ascending=False)
#         elif so == "Highest fare" and "fare" in filtered.columns:
#             filtered = filtered.sort_values("fare", ascending=False)

#         st.markdown(f'<div style="font-size:12px; color:{LIGHT_GRAY}; margin-bottom:16px;">{len(filtered)} trips</div>', unsafe_allow_html=True)

#         quality_colors = {"STRESSFUL": RED, "MODERATE": AMBER, "SMOOTH": GREEN}
#         severity_colors = {"HIGH": RED, "MEDIUM": AMBER, "LOW": LIGHT_GRAY, "NONE": MID_GRAY}

#         for _, t in filtered.iterrows():
#             tid = t.get("trip_id", "")
#             date = t.get("date", "")
#             fare = float(t.get("fare", 0))
#             dur = float(t.get("duration_min", 0))
#             dist = float(t.get("distance_km", 0))
#             fmc = int(t.get("flagged_moments_count", 0))
#             msev = t.get("max_severity", "NONE")
#             qual = t.get("trip_quality_rating", "SMOOTH")
#             qc = quality_colors.get(qual, LIGHT_GRAY)
#             sc_v = severity_colors.get(msev, MID_GRAY)

#             st.markdown(_card(
#                 f'<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">'
#                 f'<div style="min-width:100px;">'
#                 f'<div style="font-weight:600; font-size:14px;">{tid}</div>'
#                 f'<div style="font-size:12px; color:{LIGHT_GRAY}; margin-top:1px;">{date}</div>'
#                 f'</div>'
#                 f'<div style="text-align:center;">'
#                 f'<div style="font-family:DM Mono,monospace; font-size:20px; font-weight:700;">₹{fare:,.0f}</div>'
#                 f'<div style="font-size:11px; color:{LIGHT_GRAY};">{dur:.0f} min</div>'
#                 f'</div>'
#                 f'<div style="text-align:center;">'
#                 f'<div style="font-size:13px; color:{sc_v}; font-weight:600;">{fmc}</div>'
#                 f'<div style="font-size:11px; color:{LIGHT_GRAY};">moments</div>'
#                 f'</div>'
#                 f'<div>{_pill(qual.title(), qc, BLACK if qual != "STRESSFUL" else WHITE)}</div>'
#                 f'</div>',
#                 pad="16px",
#             ), unsafe_allow_html=True)

#     _footer()

# # === TAB 3 — DETAIL =======================================================
# with tab3:
#     drv_moment_trips = sorted(driver_moments["trip_id"].unique().tolist()) if "trip_id" in driver_moments.columns and not driver_moments.empty else []
#     drv_summary_trips = sorted(driver_summaries["trip_id"].unique().tolist()) if "trip_id" in driver_summaries.columns and not driver_summaries.empty else []
#     all_trip_ids = sorted(set(drv_moment_trips + drv_summary_trips))

#     if not all_trip_ids:
#         st.markdown(f'<div style="color:{LIGHT_GRAY}; padding:40px; text-align:center;">No trips available.</div>', unsafe_allow_html=True)
#     else:
#         prev = st.session_state.get("selected_trip_id", None)
#         idx = all_trip_ids.index(prev) if prev in all_trip_ids else 0
#         trip_id = st.selectbox("Trip", all_trip_ids, index=idx, key="detail_trip")

#         # Header
#         ts_row = summaries_df[summaries_df["trip_id"] == trip_id] if "trip_id" in summaries_df.columns else pd.DataFrame()
#         if not ts_row.empty:
#             r = ts_row.iloc[0]
#             cols = st.columns(5, gap="medium")
#             labels = ["Trip", "Driver", "Date", "Fare", "Duration"]
#             vals   = [trip_id, r.get("driver_id","—"), r.get("date","—"), f"₹{float(r.get('fare',0)):,.0f}", f"{float(r.get('duration_min',0)):.0f} min"]
#             for i, c in enumerate(cols):
#                 with c:
#                     st.markdown(_metric(labels[i], vals[i]), unsafe_allow_html=True)

#         trip_moments = moments_df[moments_df["trip_id"] == trip_id] if "trip_id" in moments_df.columns else pd.DataFrame()

#         if trip_moments.empty:
#             st.markdown(
#                 _card(
#                     f'<div style="text-align:center; padding:20px;">'
#                     f'<div style="font-size:15px; font-weight:600; color:{GREEN};">Smooth ride</div>'
#                     f'<div style="font-size:13px; color:{LIGHT_GRAY}; margin-top:4px;">No stress moments on this trip</div>'
#                     f'</div>'
#                 ),
#                 unsafe_allow_html=True,
#             )
#         else:
#             _divider()
#             st.markdown(f'<div style="font-size:11px; color:{LIGHT_GRAY}; text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">Timeline</div>', unsafe_allow_html=True)

#             tm = trip_moments.copy()
#             if "timestamp" in tm.columns:
#                 tm["ts"] = pd.to_datetime(tm["timestamp"], errors="coerce")
#             elif "elapsed_seconds" in tm.columns:
#                 tm["ts"] = pd.to_numeric(tm["elapsed_seconds"], errors="coerce")

#             fig = go.Figure()
#             lane_map   = {"MOTION_ONLY": 1.5, "AUDIO_ONLY": 1.0, "COMBINED": 2.0}
#             color_map  = {"HIGH": RED, "MEDIUM": AMBER, "LOW": LIGHT_GRAY}
#             symbol_map = {"MOTION_ONLY": "square", "AUDIO_ONLY": "circle", "COMBINED": "diamond"}

#             for _, m in tm.iterrows():
#                 et  = m.get("event_type", "")
#                 sev = m.get("severity", "LOW")
#                 sc_v = float(m.get("combined_score", 0))
#                 fig.add_trace(go.Scatter(
#                     x=[m.get("ts")], y=[lane_map.get(et, 1.0)],
#                     mode="markers",
#                     marker=dict(size=max(8, sc_v / 5), color=color_map.get(sev, LIGHT_GRAY),
#                                 symbol=symbol_map.get(et, "circle"), line=dict(width=0)),
#                     hovertemplate=f"<b>{et.replace('_',' ')}</b><br>{sev} · {sc_v:.0f}<extra></extra>",
#                     showlegend=False,
#                 ))

#             fig.update_layout(
#                 paper_bgcolor=OFF_BLACK, plot_bgcolor=OFF_BLACK,
#                 yaxis=dict(tickvals=[1.0, 1.5, 2.0], ticktext=["Audio", "Motion", "Combined"],
#                            range=[0.5, 2.5], color=LIGHT_GRAY, gridcolor=DARK_GRAY, gridwidth=1),
#                 xaxis=dict(gridcolor=DARK_GRAY, gridwidth=1, color=LIGHT_GRAY, title=""),
#                 height=180, margin=dict(l=0, r=0, t=8, b=0),
#                 font=dict(family="DM Sans", color=LIGHT_GRAY, size=11), showlegend=False,
#             )
#             st.plotly_chart(fig, use_container_width=True)

#             _divider()
#             st.markdown(f'<div style="font-size:11px; color:{LIGHT_GRAY}; text-transform:uppercase; letter-spacing:1px; margin-bottom:12px;">Flagged moments</div>', unsafe_allow_html=True)

#             sev_cfg = {"HIGH": (RED, "rgba(238,0,0,0.06)"), "MEDIUM": (AMBER, "rgba(245,166,35,0.06)"), "LOW": (LIGHT_GRAY, "rgba(158,158,158,0.04)")}

#             for _, m in tm.iterrows():
#                 sev = m.get("severity", "LOW")
#                 col, bg = sev_cfg.get(sev, sev_cfg["LOW"])
#                 et = str(m.get("event_type", "")).replace("_", " ").title()
#                 exp = m.get("explanation", "—")
#                 ts_raw = str(m.get("timestamp", ""))
#                 ts_disp = ts_raw.split("T")[-1][:8] if "T" in ts_raw else ts_raw
#                 conf = m.get("confidence", 0)
#                 score = m.get("combined_score", 0)
#                 ctx = m.get("context", "")

#                 try: conf_s = f"{float(conf):.0%}"
#                 except: conf_s = "—"
#                 try: score_s = f"{float(score):.0f}"
#                 except: score_s = "—"

#                 badges = f'{_pill(sev.title(), col, BLACK if sev != "LOW" else WHITE)}  '
#                 badges += f'<span style="font-size:12px; color:{LIGHT_GRAY}; font-family:DM Mono,monospace; margin-left:8px;">Confidence {conf_s}  ·  Score {score_s}</span>'
#                 if ctx and str(ctx) not in ("normal", "nan"):
#                     badges += f'<span style="font-size:11px; color:{AMBER}; margin-left:12px;">{str(ctx)}</span>'

#                 st.markdown(
#                     f'<div style="background:{bg}; border-left:3px solid {col}; border-radius:4px; padding:16px; margin-bottom:8px;">'
#                     f'<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">'
#                     f'<span style="font-weight:600; font-size:14px;">{et}</span>'
#                     f'<span style="font-family:DM Mono,monospace; font-size:12px; color:{LIGHT_GRAY};">{ts_disp}</span>'
#                     f'</div>'
#                     f'<div style="font-size:13px; color:#CCCCCC; line-height:1.5; margin-bottom:10px;">{exp}</div>'
#                     f'<div>{badges}</div>'
#                     f'</div>',
#                     unsafe_allow_html=True,
#                 )

#     _footer()

# # === TAB 4 — EXPORT =======================================================
# with tab4:
#     st.markdown(f'<div style="font-size:11px; color:{LIGHT_GRAY}; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">Outputs</div>', unsafe_allow_html=True)
#     st.markdown(f'<div style="color:{MID_GRAY}; font-size:13px; margin-bottom:20px;">Generated by the analytics engine.</div>', unsafe_allow_html=True)

#     ec1, ec2 = st.columns(2, gap="medium")

#     with ec1:
#         fm_r = len(moments_df)
#         fm_c = len(moments_df.columns) if not moments_df.empty else 0
#         st.markdown(_card(
#             f'<div style="font-size:14px; font-weight:600; margin-bottom:14px;">Flagged Moments</div>'
#             f'<div style="display:flex; gap:32px;">'
#             f'<div><div style="font-size:11px; color:{LIGHT_GRAY}; text-transform:uppercase; letter-spacing:0.8px;">Rows</div><div style="font-size:22px; font-weight:700; font-family:DM Mono,monospace;">{fm_r}</div></div>'
#             f'<div><div style="font-size:11px; color:{LIGHT_GRAY}; text-transform:uppercase; letter-spacing:0.8px;">Columns</div><div style="font-size:22px; font-weight:700; font-family:DM Mono,monospace;">{fm_c}</div></div>'
#             f'</div>'
#         ), unsafe_allow_html=True)
#         if not moments_df.empty:
#             st.download_button("Download flagged_moments.csv", data=moments_df.to_csv(index=False), file_name="flagged_moments.csv", mime="text/csv", key="dl_fm")

#     with ec2:
#         ts_r = len(summaries_df)
#         ts_c = len(summaries_df.columns) if not summaries_df.empty else 0
#         st.markdown(_card(
#             f'<div style="font-size:14px; font-weight:600; margin-bottom:14px;">Trip Summaries</div>'
#             f'<div style="display:flex; gap:32px;">'
#             f'<div><div style="font-size:11px; color:{LIGHT_GRAY}; text-transform:uppercase; letter-spacing:0.8px;">Rows</div><div style="font-size:22px; font-weight:700; font-family:DM Mono,monospace;">{ts_r}</div></div>'
#             f'<div><div style="font-size:11px; color:{LIGHT_GRAY}; text-transform:uppercase; letter-spacing:0.8px;">Columns</div><div style="font-size:22px; font-weight:700; font-family:DM Mono,monospace;">{ts_c}</div></div>'
#             f'</div>'
#         ), unsafe_allow_html=True)
#         if not summaries_df.empty:
#             st.download_button("Download trip_summaries.csv", data=summaries_df.to_csv(index=False), file_name="trip_summaries.csv", mime="text/csv", key="dl_ts")

#     st.markdown('<div style="margin-top:16px;"></div>', unsafe_allow_html=True)
#     with st.expander("Preview flagged moments"):
#         if not moments_df.empty:
#             st.dataframe(moments_df, use_container_width=True, height=280)
#     with st.expander("Preview trip summaries"):
#         if not summaries_df.empty:
#             st.dataframe(summaries_df, use_container_width=True, height=280)

#     _footer()
