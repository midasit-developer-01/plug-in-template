# 엔드포인트 인덱스 — db / doc / ope / view / post / requestinfo / config

**이 파일은 Read 하지 말고 Grep 하세요.** 한 줄이 엔드포인트 하나입니다.

설계/내진성능평가 엔드포인트는 [INDEX-design.md](./INDEX-design.md) 에 있습니다.

- `body` — `schemas/<uri>.json` 의 `example` 최상위 키. `Assign` 은 db 형태 CRUD,
  `Argument` 는 명령형, `{NAME}` 은 엔드포인트 이름이 곧 키인 경우, `(none)` 은 빈 바디.
  단 **GET / DELETE 는 바디를 보내지 않습니다** — 이 열의 값과 무관합니다.
- `feature` — 값이 있으면 `features/<uri>.json` 에 GUI 가이드(메뉴 경로 + 사용법)가 있다는 뜻.
- 전체 스키마와 동작하는 예시는 `schemas/<uri>.json`.

> 생성물입니다. 직접 고치지 말고 `node scripts/sync-api-docs.js` 로 다시 만드세요.

## config (2)

| uri | methods | body | feature | desc |
| --- | --- | --- | --- | --- |
| `config/PROJECT` | GET | Argument |  | Project Information (PROJECT). Retrieves the opened project's file dates and design code preferences; the request carries no meaningful… |
| `config/VER` | GET | Argument |  | Program Version Information (VER). Retrieves product/version metadata; the request takes no body (DTO_EMPTY), so Argument is an empty… |

## db (259)

| uri | methods | body | feature | desc |
| --- | --- | --- | --- | --- |
| `db/ACTL` | POST, GET, PUT, DELETE | Assign | Main Control Data | Analysis Control (ACTL). Single global model setting stored under key "1"; all fields are model-wide analysis flags plus the equilibrium… |
| `db/ACTL-M1` | POST, GET, PUT, DELETE | Assign |  | Main Analysis Control (ACTL-M1). Single global analysis-control record (key is always "1"); the flags govern general solver behavior and… |
| `db/ARPR` | POST, GET, PUT, DELETE | Assign |  | Area Pressure Load (ARPR). The TYPE field selects how ELEM_LISTS is interpreted: TYPE=GROUP treats ELEM_LISTS[0] as a plane/area group key… |
| `db/BCCT` | POST, GET, PUT, DELETE | Assign |  | Boundary Change Assignment to Load Cases/Analysis (BCCT). A single-instance table: bool flags select which boundary categories are… |
| `db/BCGA-M1` | POST, GET, PUT, DELETE | Assign |  | Boundary Change Assignment (BCGA-M1). A model-wide singleton (key 1): BC_ASSIGN maps each analysis/load case to a Boundary Group… |
| `db/BCGD-M1` | POST, GET, PUT, DELETE | Assign |  | Boundary Group Combination (BCGD-M1). Defines a named combination of existing boundary groups; keyed by combination id, each entry carries… |
| `db/BLDC` | POST, GET, PUT, DELETE | Assign |  | Building Control Data (BLDC). A single-instance (key = 1) definition; the bSTORY_CENTER flag plus USE_OPTION drive which story-shear-ratio… |
| `db/BMLD` | POST, GET, PUT, DELETE | Assign | Element Beam Loads | Beam Loads (BMLD). A single object keyed by element number whose ITEMS array holds one or more beam-load definitions; each item's CMD… |
| `db/BNGR` | POST, GET, PUT, DELETE | Assign | Define Boundary Group | Boundary Group (BNGR). Each key is the boundary group id; NAME sets the group name and AUTOTYPE flags an auto-generated creep/shrinkage… |
| `db/BODF` | POST, GET, PUT, DELETE | Assign | Self Weight | Self Weight (BODF). Applies a static self-weight body-force load: LCNAME selects the static load case and FV gives the self-weight scale… |
| `db/BTMP` | POST, GET, PUT, DELETE | Assign | Beam Section Temperatures | Beam Section Temperature (BTMP). Keyed by element number; ITEMS holds one temperature-load definition per element, each item's bPSC flag… |
| `db/BUCK` | POST, GET, PUT, DELETE | Assign |  | Buckling Analysis Control (BUCK). A single control record (fixed key 1) holding the eigenvalue buckling settings plus a list of load cases… |
| `db/CAMB` | POST, GET, PUT, DELETE | Assign |  | FCM Camber Control (CAMB). A single-instance bridge specialization record identifying the three model groups by name that drive… |
| `db/CCFC` | POST, GET, PUT, DELETE | Assign |  | Convection Coefficient Function (CCFC). The TYPE field selects which fields apply: CONST uses COEF; USER uses SCALE_FACTOR and the ITEM… |
| `db/CGLP` | POST, GET, PUT, DELETE | Assign |  | General Link Property Change (CGLP). Reassigns the property (and optional boundary group) of an existing General Link identified by… |
| `db/CJFG` | POST, GET, PUT, DELETE | Assign |  | Concurrent Joint Force Group (CJFG). A singleton record (key is always 1) holding the set of structure group names whose joint forces are… |
| `db/CLDR` | POST, GET, PUT | Assign | Define Constraint Label Direction | Constraint Label Direction (CLDR). Keyed by element number; each entry sets the local constraint label direction via the DIR integer code. |
| `db/CLWP` | POST, GET, PUT, DELETE | Assign | Plate Cutting Line Diagram | Plate Cutting Line Diagram (CLWP). Each entry defines a cutting line/plane by three points; DIR selects whether the line is normal to the… |
| `db/CMCS` | POST, GET, PUT, DELETE | Assign |  | Camber for Construction Stage (CMCS). Keyed by element number; each entry stores the deformation-based and user-defined camber values for… |
| `db/CMFT` | POST, GET, PUT, DELETE | Assign |  | Equivalent Moment Correction Factor Cm (CMFT). Keyed per element (integer id); OPT_AUTO decides whether Cm is auto-calculated or taken from… |
| `db/CNLD` | POST, GET, PUT, DELETE | Assign | Nodal Loads | Nodal Load (CNLD). The outer key is the node number; ITEMS holds one entry per nodal load applied to that node, each tied to a static load… |
| `db/CO_F` | GET, PUT | Assign |  | Floor Load Display Color (CO_F). Sets the display colors (wire frame, hidden fill, hidden edge) and blending for a floor load type; NAME… |
| `db/CO_M` | GET, PUT | Assign |  | Display Option Color - Material (CO_M). Per-material display colors, keyed by material id; each entry holds the wire-frame, hidden-fill and… |
| `db/CO_S` | GET, PUT | Assign |  | Section Display Color (CO_S). Per-section display color option keyed by section id; RGB triplets (0-255) set the wire frame, hidden fill… |
| `db/CO_T` | GET, PUT | Assign |  | Display Option Color - Thickness (CO_T). Per-thickness display colors: each key is a thickness id, and the fields set the wire-frame… |
| `db/CONS` | POST, GET, PUT, DELETE | Assign | Define Supports | Constraint Supports (CONS). Keyed by node number; ITEMS carries one constraint entry per boundary group applied to that node, each defining… |
| `db/CPSETTINGS` | POST, GET, PUT | Assign |  | Cooperate Civil Designer Settings (CPSETTINGS). A single-record setting (only key 1 exists); MODULE selects the civil-designer module and… |
| `db/CRGR` | POST, GET, PUT, DELETE | Assign |  | Concurrent Reaction Group (CRGR). A single global entry (key 1) whose GROUPS list selects the structure groups whose support reactions are… |
| `db/CRPC` | POST, GET, PUT, DELETE | Assign |  | Creep Coefficient for Construction Stage (CRPC). Keyed by element (entity) id; ITEMS holds one entry per load group, each carrying a creep… |
| `db/CSCS` | POST, GET, PUT, DELETE | Assign |  | Composite Section for Construction Stage (CSCS). The TYPE (composite type) and each vPARTINFO entry's MTYPE drive which fields apply; the… |
| `db/CUTL` | POST, GET, PUT, DELETE | Assign | Plate Cutting Line Diagram | Cutting Line (CUTL). Defines a cutting line for extracting analysis results along a plane; the two endpoints (PT1*, PT2*) and DIR set the… |
| `db/DMAS` | POST, GET, PUT, DELETE | Assign |  | Floor Diaphragm Masses (DMAS). Each item's MASS_TYPE selects which mass geometry block… |
| `db/DOEL` | POST, GET, PUT, DELETE | Assign | Define Domain | Domain Element (DOEL). Assigns each node/element key to a domain; TYPE selects whether the key belongs to a main domain or a sub domain… |
| `db/DRLS` | POST, GET, PUT, DELETE | Assign | Diaphragm Disconnect | Diaphragm Disconnect (DRLS). Assigns a rigid-diaphragm disconnect to a node; the assignment is keyed by node number and carries no… |
| `db/DYFG` | POST, GET, PUT, DELETE | Assign |  | Railway Dynamic Factor (DYFG). A single global setting (key is always 1) whose fields configure how the dynamic amplification factor for… |
| `db/DYLA` | POST, GET, PUT, DELETE | Assign |  | Dynamic Load Allowance (DYLA). Each key is a dynamic-load-allowance entry id; FACTOR sets the impact/dynamic amplification factor applied… |
| `db/DYNF` | POST, GET, PUT, DELETE | Assign |  | Railway Dynamic Factor by Element (DYNF). INPUT_TYPE selects which fields apply: 0 uses LENGTH/MAINTAIN_TYPE/OPT_REDUCE_EFF (and… |
| `db/EARE` | POST, GET, PUT, DELETE | Assign |  | Effective Area for Soil Pressure (EARE). Each entry associates an element and one of its nodes with the effective area used for soil… |
| `db/EBMW` | POST, GET, PUT, DELETE | Assign |  | Concrete Wall End Rebar Design Method (EBMW). One EBMW entry per wall is keyed by WALL ID and holds an ITEMS list, each entry a per-story… |
| `db/EDMP` | POST, GET, PUT, DELETE | Assign | Change Property | Change Element Dependent Material Property (EDMP). Keyed by element number; TYPE selects the size-measure interpretation of the H_VS value… |
| `db/EFCT` | POST, GET, PUT, DELETE | Assign | Initial Forces Control Data | Initial Force Control Data (EFCT). A single-instance dataset (key is always 1) defining the initial-force load case and the combination of… |
| `db/EIGV` | POST, GET, PUT, DELETE | Assign |  | Eigenvalue Analysis (EIGV). The analysis method is chosen by TYPE (EIGEN subspace iteration, LANCZOS, or RITZ vectors); TYPE decides which… |
| `db/EIGV-M1` | POST, GET, PUT, DELETE | Assign |  | Eigenvalue Analysis Control (EIGV-M1). ANAL_TYPE selects the method (LANCZOS vs RITZ) and drives which fields apply: LANCZOS uses… |
| `db/ELEM` | POST, GET, PUT, DELETE | Assign | Create Elements | Element (ELEM). TYPE selects the element family and, together with STYPE/CABLE/W_TYPE, drives which optional fields the write handler… |
| `db/ELNK` | POST, GET, PUT, DELETE | Assign | Elastic Link | Elastic Link (ELNK). The LINK type selects which fields apply: GEN uses R_S/SDR (6-component), TENS/COMP use SDR[0], MULTI LINEAR uses… |
| `db/EPMT` | POST, GET, PUT, DELETE | Assign | Plastic Material | Plastic Material (EPMT). MODEL_TYPE selects which plasticity model is used, and the matching model sub-object… |
| `db/EPMT-M1` | POST, GET, PUT, DELETE | Assign |  | Plastic Material (EPMT-M1). MODEL_TYPE selects one plastic model (Tresca:0, VonMises:1, MohrCoulomb:2, DruckerPrager:3, Masonry:4… |
| `db/EPSE` | POST, GET, PUT, DELETE | Assign |  | Seismic Earth Pressure (EPSE). SEL_TYPE drives how the loading area is defined: SEL_TYPE=ELEM uses ELEM_LIST/NODE_LIST with ELEM_TYPE… |
| `db/EPST` | POST, GET, PUT, DELETE | Assign | Static Earth Pressure | Static Earth Pressure (EPST). DIR selects XY (uses ANGLE) vs NORMAL (uses IN_PT), and SEL_TYPE selects GRUP (uses LOADING_AREA_GROUP) vs… |
| `db/EQMF` | POST, GET, PUT, DELETE | Assign |  | Equilibrium Element Nodal Force (EQMF). The ELEM_TYPE drives how many entries NODE_FORCES must contain: TRUSS uses 2 axial forces, while… |
| `db/ESQW` | POST, GET, PUT, DELETE | Assign |  | Construction Stage Loads (ESQW). A single construction-stage-wizard record (key 1) driving the construction dead load case, the erection… |
| `db/ESSF` | POST, GET, PUT, DELETE | Assign | Element Stiffness Scale Factor | Element Stiffness Scale Factor (ESSF). A single ITEMS array of scale-factor entries keyed per element; each entry carries the seven section… |
| `db/ETFC` | POST, GET, PUT, DELETE | Assign |  | Ambient Temperature Function (ETFC). TYPE selects which fields apply: CONST uses TEMP, SINE uses MAX_TEMP/MEAN_TEMP/DELAY_TIME, and USER… |
| `db/ETMP` | POST, GET, PUT, DELETE | Assign | Element Temperatures | Element Temperature (ETMP). A single ITEMS array holds one entry per element-temperature assignment; each entry pairs a static load case… |
| `db/EVGP` | POST, GET, PUT, DELETE | Assign |  | Evaluation Group Assignment (EVGP). TYPE (PIER or ABUTMENT) together with bPIERCAP and bLINK/LINK_TYPE drive which optional fields apply. |
| `db/EWSF` | POST, GET, PUT, DELETE | Assign |  | Effective Width Scale Factor (EWSF). Keyed by element number; ITEMS is a list of scale-factor definitions, one per boundary group, applied… |
| `db/EXLD` | POST, GET, PUT, DELETE | Assign | External Type Load Case for Pretension | Prestress Loads (EXLD). Defines the set of static load cases treated as external-type (pretension) load cases; the sole key LCNAME_ITEM… |
| `db/FBLA` | POST, GET, PUT, DELETE | Assign | Assign Floor Loads | Floor Load (FBLA). FLOOR_DIST_TYPE selects the distribution model and drives which fields apply: sub-beam and unit-weight fields… |
| `db/FBLD` | POST, GET, PUT, DELETE | Assign | Define Floor Load Type | Floor Load Type (FBLD). Defines a named floor load type composed of up to 8 floor load items, each tying a static load case name to a floor… |
| `db/FIBR` | POST, GET, PUT, DELETE | Assign | Fiber Division of Section | Fiber Section Division (FIBR). Defines the fiber discretization assigned to a section (SECT_KEY); each entry in FIBR_BASE is one fiber, and… |
| `db/FIBW` | POST, GET, PUT, DELETE | Assign |  | Fiber Wall Section Division (FIBW). Defines the fiber-based section division of a wall: the per-fiber material names/colors (up to 6), the… |
| `db/FIMP` | POST, GET, PUT, DELETE | Assign | Inelastic Material Properties | Inelastic Material Property (FIMP). MATL_TYPE (CONC or STEEL) and HYS_MODEL together select which child object under CONC or STEEL carries… |
| `db/FMLD` | POST, GET, PUT, DELETE | Assign |  | Finishing Material Load (FMLD). One or more finishing-material load items are supplied under ITEMS; each item describes a covering applied… |
| `db/FRLS` | POST, GET, PUT, DELETE | Assign | Beam End Release | Beam End Release (FRLS). Keyed by element number; each element carries an ITEMS array where every entry defines the i-end/j-end release… |
| `db/GALD` | POST, GET, PUT, DELETE | Assign |  | Grid Model Analysis Loads (GALD). LCTYPE (DL/VLL/CLL/OLL) selects which sub-key of SUBTYPE and LOAD applies; each LOAD sub-key holds an… |
| `db/GCMB` | POST, GET, PUT, DELETE | Assign |  | General Camber Control (GCMB). A single-key (Civil-only) record whose GCMB_BASE_ITEMS list pairs each structure group with a camber… |
| `db/GRDP` | POST, GET, PUT, DELETE | Assign | Group Damping : Element Mass & Stiffness Proportional | Group Damping (GRDP). A single global record (key is always 1) holding default Rayleigh/damping settings plus per-group damping… |
| `db/GRUP` | POST, GET, PUT, DELETE | Assign | Define Structure Group | Structure Group (GRUP). Each key is a group id; NAME identifies the group, and N_LIST / E_LIST enumerate the nodes and elements assigned to… |
| `db/GSBG` | POST, GET, PUT, DELETE | Assign |  | Girder-Stress Diagram Batch Group (GSBG). A single flat record per key defining a bridge girder stress/force diagram batch group; DGRM_TYPE… |
| `db/GSPR` | POST, GET, PUT, DELETE | Assign | General Spring Supports | General Spring (GSPR). Assigns previously defined general spring types (TYPE_NAME) to a node key; each entry in ITEMS links the node to a… |
| `db/GSTP` | POST, GET, PUT, DELETE | Assign | Define General Spring Type | General Spring Type (GSTP). Defines a named general spring whose 6x6 symmetric stiffness (SPRING), mass (MASS) and damping (DAMPING)… |
| `db/GTMP` | POST, GET, PUT, DELETE | Assign | Temperature Gradient | Temperature Gradient Loads (GTMP). Each entry is keyed by an element key and carries an ITEMS array; each item's TYPE (1: Beam / 2: Plate)… |
| `db/HAHS` | POST, GET, PUT, DELETE | Assign |  | Heat of Hydration Loads (HAHS). Assigns a heat source to an element by referencing a Heat Source Function (HSFC) by name; the referenced… |
| `db/HECB` | POST, GET, PUT, DELETE | Assign |  | Element Convection Boundary (HECB). One record per element key holds an ITEMS array; each item binds an element face to a Convection… |
| `db/HHCT` | POST, GET, PUT, DELETE | Assign |  | Heat of Hydration Control Data (HHCT). Single-instance control record (key 1); FINAL_STAGE, OPT_IS_CREEP_SHRINKAGE and (inside ITEM)… |
| `db/HHCT-M1` | POST, GET, PUT, DELETE | Assign |  | Heat of Hydration Analysis Control Data (HHCT-M1). A single-instance record; FINAL_STAGE selects the target construction stage… |
| `db/HHND` | POST, GET, PUT, DELETE | Assign |  | Heat of Hydration Result Graph Node (HHND). Defines a monitoring point for heat-of-hydration stress results; TYPE selects whether the point… |
| `db/HPCE` | POST, GET, PUT, DELETE | Assign |  | Pipe Cooling (HPCE). Defines a pipe-cooling element for heat-of-hydration analysis; ITEMS lists the node keys cooled by the pipe, and… |
| `db/HSFC` | POST, GET, PUT, DELETE | Assign |  | Heat Source Function (HSFC). The TYPE field selects which fields apply: CONST uses TEMP_CONST; FUNC uses OPT_USE_CONC_DATA to switch… |
| `db/HSPT` | POST, GET, PUT, DELETE | Assign |  | Heat of Hydration Prescribed Temperature Load (HSPT). Keyed by element/entity id; each entry carries an ITEMS array where every item… |
| `db/HSTG` | POST, GET, PUT, DELETE | Assign |  | Heat of Hydration Loads (HSTG). Defines a hydration analysis stage with an additional-step time list plus the structure/boundary/load… |
| `db/IEHC` | POST, GET, PUT, DELETE | Assign | Inelastic Properties Control Data | Inelastic Hinge Control Data (IEHC). A single model-wide record (always key 1) controlling fiber-section discretization for beam-column and… |
| `db/IEHG` | POST, GET, PUT, DELETE | Assign | Assign Inelastic Hinge Properties | Inelastic Hinge (IEHG). Assigns an inelastic hinge to an element by referencing an existing Inelastic Hinge Property (PROP_NAME) and a… |
| `db/IEHG-BEAM-M1` | POST, GET, PUT, DELETE | Assign |  | Inelastic Hinge Property Assignment - Beam (IEHG-BEAM-M1). Assigns a named inelastic hinge property to a beam-type object; the record is… |
| `db/IEHG-GL-M1` | POST, GET, PUT, DELETE | Assign |  | Inelastic Hinge Assignment for General Link (IEHG-GL-M1). Assigns a previously defined Inelastic Hinge Property to a general-link object… |
| `db/IEHG-PSS-M1` | POST, GET, PUT, DELETE | Assign |  | Inelastic Hinge Property Assignment - Pushover Shell/PSS (IEHG-PSS-M1). Links a model object (keyed by id) to a previously defined… |
| `db/IEHG-TRUSS-M1` | POST, GET, PUT, DELETE | Assign |  | Inelastic Hinge Property Assignment for Truss elements (IEHG-TRUSS-M1). Assigns an existing inelastic hinge property (by name) to… |
| `db/IEHP` | POST, GET, PUT, DELETE | Assign |  | Inelastic Hinge Property (IEHP). Defines the skeleton curve / hysteresis model for an inelastic hinge; DEFINITION (SKEL vs FIBER)… |
| `db/IELC` | POST, GET, PUT, DELETE | Assign | Ignore Elements for Load Case | Ignore Element for Load Cases (IELC). Each entry pairs an existing element with a static load case name and flags whether that element is… |
| `db/IEPI` | POST, GET, PUT, DELETE | Assign | Ignore Elements for NL. Analysis Initial Load | Ignore Elements for Nonlinear Analysis Initial Load (IEPI). Keyed by element number; each entry carries the single flag that controls… |
| `db/IFGS` | POST, GET, PUT, DELETE | Assign | Initial Forces for Geometric Stiffness | Initial Force for Geometric Stiffness (IFGS). Keyed by element number; each entry sets the initial force direction and magnitude used to… |
| `db/IMFM` | POST, GET, PUT, DELETE | Assign | Inelastic Material Properties | Inelastic Material Property for Fiber Model (IMFM). Each key is a material id; which name fields apply depends on the referenced material's… |
| `db/IMFM-M1` | POST, GET, PUT, DELETE | Assign |  | Inelastic Material for Auto Generation (IMFM-M1). Keyed by the material id; the record links a model material to inelastic (fiber) material… |
| `db/IMPF` | POST, GET, PUT, DELETE | Assign |  | Moving Load Impact Factor (IMPF). Assigned per element key; ITEMS holds one entry per lane, whose fields depend on FACT_TYPE (impact factor… |
| `db/INMF` | POST, GET, PUT, DELETE | Assign | Initial Element Forces | Initial Element Force (INMF). Keyed by element ID; ELEM_TYPE selects the force layout, where TRUSS uses 2 axial forces (i- and j-end) and… |
| `db/IPCR` | POST, GET, PUT, DELETE | Assign |  | Imperfection Load (IPCR). A single imperfection-load record keyed by integer id; NATIONAL_CODE selects the code basis (0=Global, 1=China)… |
| `db/IPDT` | POST, GET, PUT, DELETE | Assign |  | Imperfection Data (IPDT). One entry per story key; the story key ties the imperfection settings (initial column-inclination and user… |
| `db/KFAC` | POST, GET, PUT, DELETE | Assign |  | Effective Length Factor (KFAC). Each entry is keyed by an integer id and holds the effective length factors used in steel/RC/SRC member… |
| `db/LCOM-ALUM` | POST, GET, PUT, DELETE | Assign |  | Aluminum Design Load Combination (LCOM-ALUM). Each keyed entry is one load combination for aluminum design; NAME and the vCOMB list of… |
| `db/LCOM-CFSTEEL` | POST, GET, PUT, DELETE | Assign |  | Cold-Formed Steel Design Load Combination (LCOM-CFSTEEL). Each keyed entry is one load combination for cold-formed steel design; NAME and… |
| `db/LCOM-CONC` | POST, GET, PUT, DELETE | Assign |  | Load Combination for Concrete Design (LCOM-CONC). One entry per load combination keyed by combination id; each combination lists its member… |
| `db/LCOM-FDN` | POST, GET, PUT, DELETE | Assign |  | Load Combination for Foundation Design (LCOM-FDN). One entry per load combination keyed by combination id; each combination lists its… |
| `db/LCOM-GEN` | POST, GET, PUT, DELETE | Assign |  | Load Combination for General analysis results (LCOM-GEN). One combination per key; NAME and the vCOMB list of (analysis type, load case… |
| `db/LCOM-LINEAR` | POST, GET, PUT, DELETE | Assign |  | Linear Analysis Load Combination (LCOM-LINEAR). Each keyed entry is one load combination used for linear analysis results evaluation; NAME… |
| `db/LCOM-SEISMIC` | POST, GET, PUT, DELETE | Assign |  | Load Combination for Seismic Design (LCOM-SEISMIC). A named seismic-design load combination whose members are listed in vCOMB; each member… |
| `db/LCOM-SRC` | POST, GET, PUT, DELETE | Assign |  | Load Combination for SRC Design (LCOM-SRC). One entry per load combination id; each combination carries a list of (analysis type, load… |
| `db/LCOM-STEEL` | POST, GET, PUT, DELETE | Assign |  | Steel Design Load Combination (LCOM-STEEL). Each keyed entry is one load combination for steel design; NAME and the vCOMB list of… |
| `db/LCOM-STLCOMP` | POST, GET, PUT, DELETE | Assign |  | Steel Composite Load Combination (LCOM-STLCOMP). One entry per combination id; each combination carries a list of (load case, factor) terms… |
| `db/LDGR` | POST, GET, PUT, DELETE | Assign | Define Load Group | Load Group (LDGR). Each entry is keyed by a load group id and carries only the group name; the name is the sole field written on set. |
| `db/LDSQ` | POST, GET, PUT, DELETE | Assign |  | Loading Sequence (LDSQ). A single record (key 1) whose LCNAME_ITEM lists static load case names in the order they are applied; the handler… |
| `db/LLAN` | POST, GET, PUT, DELETE | Assign | Traffic Line Lanes | Traffic Line Lane (LLAN). COMMON holds the lane definition; provide EITHER LANE_ITEMS (per-element rows) OR SPECIAL_LANE_ITEMS (bulk import… |
| `db/LLANCH` | POST, GET, PUT, DELETE | Assign | Traffic Line Lanes | Traffic Line Lane - China (LLANCH). Defines a moving-load traffic line lane; COMMON holds the lane header and either LANE_ITEMS… |
| `db/LLANID` | POST, GET, PUT, DELETE | Assign | Traffic Line Lanes | Traffic Line Lane - India (LLANID). Defines an India-code moving-load traffic line lane; COMMON holds lane-wide settings while lane element… |
| `db/LLANJP` | POST, GET, PUT, DELETE | Assign |  | Traffic Line Lane - Japan (LLANjp). Defines a moving-load traffic lane (Japan) with common lane settings plus a list of lane element data… |
| `db/LLANOP` | POST, GET, PUT, DELETE | Assign | Traffic Line Lanes | Traffic Line Lane - Moving Load Optimization (LLANOP). Defines a moving-load optimization line lane; lane data can be supplied per-lane via… |
| `db/LLANTR` | POST, GET, PUT, DELETE | Assign | Traffic Line Lanes | Traffic Line Lane - Transverse (LLANTR). Defines a transverse moving-load traffic lane by name and its lane data; lane elements/factors are… |
| `db/LTOM` | POST, GET, PUT, DELETE | Assign | Loads to Masses | Loads to Masses (LTOM). Singleton settings that convert selected static load types into masses along the chosen direction, scaled per load… |
| `db/MADO` | POST, GET, PUT, DELETE | Assign | Define Domain | Mesh Analysis Domain (MADO). Defines a named analysis domain characterized by its element type, material, property, and sub type; all keys… |
| `db/MATD` | GET, PUT | Assign | Modify Concrete Material | Material Design Data (MATD). The TYPE field (STEEL/CONC/SRC) selects which sub-blocks of DATA1/DATA2 and which rebar/serviceability fields… |
| `db/MATL` | POST, GET, PUT, DELETE | Assign | Material Properties | Material (MATL). TYPE selects the material category and each PARAM entry's P_TYPE (1=Standard, 2=User-defined isotropic, 3=User-defined… |
| `db/MATL-M1` | POST, GET, PUT, DELETE | Assign |  | Material Property (MATL-M1). MATL_TYPE selects the material category and each PARAM item's P_TYPE (0=Standard from code DB, 1=Isotropic… |
| `db/MBTP` | POST, GET, PUT, DELETE | Assign | Modify Member Type | Member Type (MBTP). Assigns a design member-type classification to an element key; the single TYPE field selects the member role used by… |
| `db/MCON` | POST, GET, PUT, DELETE | Assign | Linear Constraints | Linear Constraints (MCON). Each ITEMS entry defines one constraint whose per-slave fields depend on TYPE: TYPE=EX uses DOF/COEFF and… |
| `db/MDGN` | POST, GET, PUT, DELETE | Assign |  | Design Rebar Material Code / User Rebar (MDGN). A single-instance database (only key 1 exists) holding the concrete and SRC rebar material… |
| `db/MEMB` | POST, GET, PUT, DELETE | Assign | Member Assignment | Member Assignment (MEMB). Groups a set of connected elements into a single design/rating member; the member key drives which contiguous… |
| `db/MLFC` | POST, GET, PUT, DELETE | Assign |  | Force/Moment Deformation Function (MLFC). Each key is a function id; TYPE selects whether the ITEMS X/Y pairs describe a… |
| `db/MLSP` | POST, GET, PUT, DELETE | Assign | Lane Supports(Negative Moments at Interior Piers) | Moving Load Support - Negative Moment (MLSP). TYPE selects the input mode: 'User Input' drives element-based fields (ELEMENT_NO… |
| `db/MLSR` | POST, GET, PUT, DELETE | Assign | Lane Supports(Negative Moments at Interior Piers) | Moving Load Support Reaction at Interior Piers (MLSR). The record key must be an existing node number; NODE is the only field and is stored… |
| `db/MRFT` | POST, GET, PUT, DELETE | Assign |  | Moment Redistribution Factor (MRFT). Keyed by element id; can only be assigned to BEAM-type elements, and the single FACTOR value scales… |
| `db/MTCS` | POST, GET, PUT, DELETE | Assign |  | Material Coordinate System (MTCS). Defines a local coordinate system from an origin, a point on the X axis (P1), and a point on the XY… |
| `db/MVCD` | POST, GET, PUT, DELETE | Assign | Moving Load Code | Moving Load Code (MVCD). Single-entry setting (key 1) that selects the national design code governing the moving-load database; the CODE… |
| `db/MVCT` | POST, GET, PUT, DELETE | Assign |  | Moving Load Analysis Control (MVCT). A single-instance control record (key is always 1); POINT/iIGP select the influence-line point… |
| `db/MVCTBS` | POST, GET, PUT, DELETE | Assign |  | Moving Load Analysis Control - BS (MVCTBS). Controls how moving-load influence results are generated and which… |
| `db/MVCTCH` | POST, GET, PUT, DELETE | Assign |  | Moving Load Analysis Control Data - China (MVCTCH). Only a single record (id "1") exists; the impact-factor block is driven by iCODETYPE (0… |
| `db/MVCTID` | POST, GET, PUT, DELETE | Assign |  | Moving Load Analysis Control Data - India (MVCTID). Controls how moving-load (IRC/India) analysis results are generated: influence-point… |
| `db/MVCTTR` | POST, GET, PUT, DELETE | Assign |  | Moving Load Analysis Control Data - Transverse (MVCTTR). Single-instance record (key 1); INFL_GEN_POINT selects the influence-line… |
| `db/MVHC` | POST, GET, PUT, DELETE | Assign |  | Vehicle Class (MVHC). Groups named moving-load vehicle definitions into a class by listing the vehicle load names that belong to it. |
| `db/MVHL` | POST, GET, PUT, DELETE | Assign | Vehicles | Moving Loads (MVHL). MVLD_CODE selects the design-code family and must match the model's Moving Load Code (MVCD); VEHICLE_LOAD_NUM=1 for a… |
| `db/MVHLTR` | POST, GET, PUT, DELETE | Assign | Vehicles | Vehicle Load - Transverse (MVHLTR). Defines a transverse moving vehicular load; the median-strip option controls whether the left-lane… |
| `db/MVLD` | POST, GET, PUT, DELETE | Assign | Moving Load Cases | Moving Loads (MVLD). TYPE selects which sub-object drives the data: 0 = General/Default (use DEFAULT), 1 = Load Case for Permit Vehicle… |
| `db/MVLDBS` | POST, GET, PUT, DELETE | Assign | Moving Load Cases | Moving Load Case - BS (MVLDBS). Which load-case-data object is required is driven by bAUTOOPTIMIZE (optimization on/off) and LOADMODEL… |
| `db/MVLDCH` | POST, GET, PUT, DELETE | Assign | Moving Load Cases | Moving Load Case - China (MVLDCH). OPT_AUTO_OPTIMIZE drives which sub-fields apply: false uses SUB_LOAD_ITEMS; true uses the… |
| `db/MVLDEU` | POST, GET, PUT, DELETE | Assign | Moving Load Cases | Moving Load Case - Eurocode (MVLDEU). Fields are driven by TYPE_LOADMODEL (1=LM1 Type1, 2=LM Type2, 3=LM3 Type3, 4=LM1&3 Multi/Straddling… |
| `db/MVLDID` | POST, GET, PUT, DELETE | Assign | Moving Load Cases | Moving Load Case - India (MVLDID). Fields are driven by OPT_LC_FOR_PERMIT_LOAD (permit-vehicle vs. |
| `db/MVLDJP` | POST, GET, PUT, DELETE | Assign |  | Moving Load Cases - Japan (MVLDJP). Which nested load block (LLOAD/MLOAD/TLOAD) is actually consumed is driven by LL_TYPE. |
| `db/MVLDPL` | POST, GET, PUT, DELETE | Assign | Moving Load Cases | Moving Load Case - Poland (MVLDPL). Fields are driven by bPERMIT_LOAD (Permit Load), bAUTO_OPTIMIZE (Auto Optimize) and LOAD_MODEL, which… |
| `db/MVLDTR` | POST, GET, PUT, DELETE | Assign | Moving Load Cases | Moving Load Case - Transverse (MVLDTR). A transverse moving load case that references a moving vehicle load (MVHL) and a line lane… |
| `db/NBOF` | POST, GET, PUT, DELETE | Assign | Nodal Body Force | Nodal Body Force (NBOF). Applies body-force load factors to a set of nodes; OPT_USE_GROUP decides whether the target set comes from a… |
| `db/NLCT` | POST, GET, PUT, DELETE | Assign |  | Nonlinear Analysis Control Data (NLCT). A single global record (key 1); ITERATION_METHOD selects the global solution scheme… |
| `db/NLCT-M1` | POST, GET, PUT, DELETE | Assign |  | Nonlinear Analysis Control Data (NLCT-M1). LC_SCOPE decides whether one global setting (ALL, key must be 1) or per-load-case settings… |
| `db/NLLP` | POST, GET, PUT, DELETE | Assign | General Link Properties | General Link Property (NLLP). APPLICATION_TYPE selects the category (ELEMENT / FORCE / ELEMENT2), APPLICATION_TYPE_D names the concrete… |
| `db/NLNK` | POST, GET, PUT, DELETE | Assign | General Link | General Link (NLNK). REF_SYSTEM chooses the orientation input: when 0 (Element system) BETA_ANGLE is used; when 1 (Global/User system)… |
| `db/NLNK-M1` | POST, GET, PUT, DELETE | Assign |  | General Link (NLNK-M1). Connects two nodes with a general-link property; REF_SYSTEM chooses the reference coordinate system (0=Element uses… |
| `db/NMAS` | POST, GET, PUT, DELETE | Assign | Nodal Masses | Nodal Mass (NMAS). Assigns lumped translational and rotational masses at a node; the key equals the target node number (a node with that… |
| `db/NODE` | POST, GET, PUT, DELETE | Assign | Create Nodes | Node (NODE). A single structural node located by its global Cartesian coordinates X, Y, Z; the id key is the node number. |
| `db/NPLN` | POST, GET, PUT, DELETE | Assign | Named Plane | Named Plane (NPLN). TYPE selects the definition mode: TYPE 1 defines the plane from three points (POINT); any other TYPE defines it by a… |
| `db/NSPR` | POST, GET, PUT, DELETE | Assign | Point Spring Supports | Point Spring (NSPR). Each Assign key is a node number whose ITEMS list holds one or more spring definitions; per-item field applicability… |
| `db/NTMP` | POST, GET, PUT, DELETE | Assign | Nodal Temperatures | Nodal Temperature (NTMP). Each key is a node number; ITEMS holds one entry per (load case, load group) nodal temperature assigned to that… |
| `db/NUCS` | POST, GET, PUT, DELETE | Assign |  | Named User Coordinate System (NUCS). Each entry defines a local coordinate system by its origin point and the direction vectors of its… |
| `db/OFFS` | POST, GET, PUT, DELETE | Assign | Beam End Offsets | Beam End Offset (OFFS). Keyed by element number; ITEMS holds one or more offset definitions whose TYPE (GLOBAL or ELEMENT) selects which… |
| `db/PDEL` | POST, GET, PUT, DELETE | Assign |  | P-Delta Analysis Control (PDEL). A single-instance (key 1) analysis control defined by the iteration count, convergence tolerance, and a… |
| `db/PHGE` | POST, GET, PUT, DELETE | Assign |  | Pushover Hinge Properties (PHGE). Assigns a pushover hinge to an object; TYPE selects which element category… |
| `db/PHGT` | POST, GET, PUT, DELETE | Assign |  | Pushover Hinge Type/Properties (PHGT). Defines an inelastic (pushover) hinge; the ELEM_TYPE, MATERIAL_TYPE and DEFINITION drive which… |
| `db/PJCF` | POST, GET, PUT, DELETE | Assign | Project Information | Project Information (PJCF). A single-key record (key is always 1) holding project metadata, contact details, and the review/approval log… |
| `db/PLCB` | POST, GET, PUT, DELETE | Assign |  | Pre-Combined Load Case (PLCB). A single global record (key is always 1) holding the list of static load cases combined into the… |
| `db/PNLA` | POST, GET, PUT, DELETE | Assign | Assign Plane Loads | Plane Load (PNLA). A static plane load applied to plate or solid elements; ELEM_TYPE selects the element family (PLATE vs SOLID) and… |
| `db/PNLD` | POST, GET, PUT, DELETE | Assign | Define Plane Load Type | Plane Load (PNLD). LTYPE selects which load-data block applies: POINT uses POINTLOAD, LINE uses LINELOAD, AREA uses AREALOAD. |
| `db/POGD` | POST, GET, PUT, DELETE | Assign |  | Pushover Global Control (POGD). Single global-setting record (only key 1 exists); its behavior is driven by the two required nested option… |
| `db/POGD-M1` | POST, GET, PUT, DELETE | Assign |  | Pushover Global Control (POGD-M1). Single-instance global setting for MEC pushover analysis; ITER_CTRL is required while ANALYSIS_STOP… |
| `db/POLC` | POST, GET, PUT, DELETE | Assign | Pushover Load Case | Pushover Load Case (POLC). INCRE_METHOD selects load- vs displacement-control fields, DISPCTRLOPTION selects global vs master-node… |
| `db/POLC-M1` | POST, GET, PUT, DELETE | Assign |  | Pushover Load Case (POLC-M1). Field applicability is driven by INCRE_METHOD (LOAD vs DISP, selecting which CTRL_OPT sub-fields apply) and… |
| `db/POSL` | POST, GET, PUT, DELETE | Assign | Seismic Loads | Seismic Load Parameters (POSL). METHOD (RES_DISP vs EQV_STATIC) plus SZ/SC/EPA drive the seismic-coefficient computation, and… |
| `db/POSP` | POST, GET, PUT, DELETE | Assign | Parameters of Soil Properties | Soil Property (POSP). Defines a layered ground soil profile: top-level level values and an ITEMS array describing each soil layer used to… |
| `db/PRES` | POST, GET, PUT, DELETE | Assign | Assign Pressure Loads | Pressure Load (PRES). A single ITEMS array of pressure-load objects; ELEM_TYPE (PLATE/PLANE/SOLID) and FACE_EDGE_TYPE (FACE/EDGE/PRES)… |
| `db/PRLS` | POST, GET, PUT, DELETE | Assign | Plate End Release | Plate End Release (PRLS). The entity key is the plate element number; ITEMS is a list of release definitions for that element, each… |
| `db/PRST` | POST, GET, PUT, DELETE | Assign | Prestress Beam Loads | Prestress Loads (PRST). Keyed by element number; each element carries a list of ITEMS, one prestress (tension) load per entry, tied to a… |
| `db/PSLT` | POST, GET, PUT, DELETE | Assign | Pressure Loads | Pressure Load Type (PSLT). Defines a named pressure-load type bound to an element geometry (ELEM_TYPE) plus a list of per-load-case… |
| `db/PSSF` | POST, GET, PUT, DELETE | Assign | Plate Stiffness Scale Factor | Plate Stiffness Scale Factor (PSSF). Keyed by element number; the ITEMS array holds one scale-factor set per boundary group, each entry… |
| `db/PTNS` | POST, GET, PUT, DELETE | Assign | Pretension Loads | Prestress Loads (PTNS). Each element key maps to an ITEMS array of pretension load entries; each item ties a static load case (and optional… |
| `db/PZEF` | POST, GET, PUT | Assign | Panel Zone Effects | Panel Zone Effect (PZEF). A single-key (id "1") global setting controlling panel zone offset calculation; all three fields are applied… |
| `db/RIGD` | POST, GET, PUT, DELETE | Assign | Rigid Link | Rigid Link (RIGD). The key is the master node number (entity key); ITEMS holds one or more rigid-link definitions, each pairing a… |
| `db/RISS` | POST, GET, PUT, DELETE | Assign |  | Reduce Infill Strut Stiffness (RISS). Boundary attribute keyed by element key that flags whether the infill strut stiffness is reduced for… |
| `db/RPSC` | POST, GET, PUT, DELETE | Assign |  | Reinforcement of Section (RPSC). Keyed by section id; SBAR_ITEMS carries shear/web/torsion/stirrup reinforcement (index 0 = i-section… |
| `db/SBCT` | POST, GET, PUT, DELETE | Assign |  | Suspension Bridge Analysis Control (SBCT). A single-instance control (key is always 1); ANAL_METHOD_TYPE drives which group field applies… |
| `db/SBDO` | POST, GET, PUT, DELETE | Assign | Define Sub-Domain | Sub Domain (SBDO). Defines a rebar sub-domain over a parent design domain (DOMAIN_NAME); MEMB_TYPE_CIVIL selects the member type and… |
| `db/SDHY` | POST, GET, PUT, DELETE | Assign | Hysteretic Isolator (MSS) | Hysteretic Isolator Property (SDHY). Defines a shear-spring hysteretic seismic isolator; SDHY_HYS_MODEL selects the hysteresis rule and the… |
| `db/SDIS` | POST, GET, PUT, DELETE | Assign | Isolator (MSS) | Seismic Isolator Property (SDIS). SDIS_DEV_TYPE selects the device model and determines which sub-object (LRB, NRB, or SB) supplies the… |
| `db/SDSP` | POST, GET, PUT, DELETE | Assign | Specified Displacements of Supports | Specified Displacements of Supports (SDSP). Each node key holds one ITEMS array; every item pairs a static load case (LCNAME) with 6… |
| `db/SDST` | POST, GET, PUT, DELETE | Assign | Steel Damper | Steel Damper (SDST). The SDST_HYS_MODEL selects which hysteresis sub-object (BL2/LY2/LY3/IK2) supplies the model-specific parameters, while… |
| `db/SDVE` | POST, GET, PUT, DELETE | Assign | Viscoelastic Damper | Viscoelastic Damper (SDVE). One entry per damper id; MATERIAL_TYPE and DIR select the viscoelastic material and acting direction, while the… |
| `db/SDVI` | POST, GET, PUT, DELETE | Assign | Viscous Damper/ Oil Damper | Viscous Damper / Oil Damper (SDVI). DAMPER_TYPE, DASHPOT_TYPE, INPUT_TYPE and INPUT_TYPE_EXFN select the damper model and which per-DOF… |
| `db/SECF` | POST, GET, PUT, DELETE | Assign | Section Stiffness Scale Factor | Section Stiffness Scale Factor (SECF). The ITEMS array holds one entry per section-stiffness scale-factor definition; IPART selects which… |
| `db/SECP` | POST, GET, PUT, DELETE | Assign |  | Composite Section for PSC Design (SECP). Per section key, defines whether the composite section is used for PSC design and the two-part… |
| `db/SECT` | POST, GET, PUT, DELETE | Assign | Section Properties | Section (SECT). A single structural cross-section keyed by section id; SECTTYPE selects the section family and SECT_BEFORE (plus SECT_AFTER… |
| `db/SECV` | POST, GET, PUT, DELETE | Assign |  | Section Variation (SECV). A section-variation record keyed by a VBEM element key (the key must already exist as a VBEM key); it reuses the… |
| `db/SEIS` | POST, GET, PUT, DELETE | Assign |  | Seismic Load (SEIS). The SEIS_LOAD_CODE string selects exactly one nested code sub-object (KS1992, UBC1997, KDS2019, ... |
| `db/SGLD` | GET | Assign |  | Construction Stage Load Case (SGLD). Fields describe a single construction-stage static load case; the load-case category is driven by TYPE. |
| `db/SINF` | POST, GET, PUT, DELETE | Assign | Plate Elements for Influence Surface | Plate Elements for Influence Surface (SINF). A single global record whose ELEM_LISTS field enumerates the plate element numbers designated… |
| `db/SKEW` | POST, GET, PUT, DELETE | Assign | Node Local Axis | Node Local Axis (SKEW). The iMETHOD field selects the input method (1=Angle, 2=3 Points, 3=Vector, 4=Line Vector) and determines which of… |
| `db/SLAN` | POST, GET, PUT, DELETE | Assign | Traffic Surface Lanes | Traffic Surface Lane (SLAN). One lane definition per key; the lane geometry is driven by NAME/WIDTH/MV_DIR plus the LANE_ITEMS list of… |
| `db/SLANCH` | POST, GET, PUT, DELETE | Assign | Traffic Surface Lanes | Traffic Surface Lane - China (SLANCH). Defines a China-code moving-load traffic surface lane along a chain of nodes; the lane… |
| `db/SLANOP` | POST, GET, PUT, DELETE | Assign | Traffic Surface Lanes | Traffic Surface Lane - Moving Load Optimization (SLANOP). Defines an optimized moving-load traffic lane; the lane-item list used is driven… |
| `db/SMCT` | POST, GET, PUT, DELETE | Assign |  | Settlement Analysis Control Data (SMCT). A single-instance control record (key is always 1) toggling whether concurrent forces are computed… |
| `db/SMLC` | POST, GET, PUT, DELETE | Assign |  | Settlement Load Case (SMLC). A settlement load case bundles a scale factor, a min/max range of active settlement groups, and the list of… |
| `db/SMPT` | POST, GET, PUT, DELETE | Assign | Settlement Group | Settlement Point Group (SMPT). Defines a settlement load group with a prescribed settlement displacement applied to a list of nodes; all… |
| `db/SPAN` | POST, GET, PUT, DELETE | Assign |  | Span (SPAN). Defines a span line used for construction-stage/bridge analysis; the exact-span flag together with the SPAN_LIST lengths and… |
| `db/SPFC` | POST, GET, PUT, DELETE | Assign | Response Spectrum Functions | Response Spectrum Function (SPFC). The design code selected in STR.SPEC_CODE (default 'USER') decides which STR/OPT/VAL/VA2 sub-fields are… |
| `db/SPLC` | POST, GET, PUT, DELETE | Assign |  | Response Spectrum Load Case (SPLC). A spectrum load case referencing one or more spectrum functions (aFUNCNAME); optional blocks are gated… |
| `db/SSEIS` | POST, GET, PUT, DELETE | Assign |  | Static Seismic Load (SSEIS). SEIS_CODE selects the seismic code and, via a flattened per-code payload, which extra fields apply: KDS2019… |
| `db/SSPS` | POST, GET, PUT, DELETE | Assign | Surface Spring Supports | Surface Spring Support (SSPS). Distributed spring support assigned per element (entity key); each entry in ITEMS is one spring definition… |
| `db/STAG` | POST, GET, PUT, DELETE | Assign |  | Construction Stage (STAG). One stage per key; the vector fields (ACT_ELEM/DACT_ELEM/ACT_BNGR/DACT_BNGR/ACT_LOAD/DACT_LOAD) list the… |
| `db/STBK` | POST, GET, PUT, DELETE | Assign |  | Set-Back Loads for Nonlinear Construction Stage (STBK). Each entry, keyed by its load id, defines a set-back displacement load acting… |
| `db/STCT` | POST, GET, PUT, DELETE | Assign |  | Construction Stage Analysis Control (STCT). Single-instance control record (key is always 1); the boolean gate flags (bLAST_FINAL… |
| `db/STCT-M1` | POST, GET, PUT, DELETE | Assign |  | Construction Stage Analysis Control (STCT-M1). A single global control record for construction-stage (MEC) analysis; the analysis type… |
| `db/STDG` | POST, GET, PUT, DELETE | Assign |  | Story Diaphragm Group (STDG). Associates a story (the id key = story key) with a boundary group; both the story name and the target… |
| `db/STLD` | POST, GET, PUT, DELETE | Assign | Static Load Cases | Static Load Case (STLD). Defines a static load case identified by a unique NAME and a load-case TYPE code; the record is keyed by its… |
| `db/STMP` | POST, GET, PUT, DELETE | Assign | System Temperature | System Temperature (STMP). Defines a uniform system temperature load referencing an existing static load case (LCNAME) and optionally a… |
| `db/STOR` | POST, GET, PUT, DELETE | Assign | Story | Story (STOR). One entry per story keyed by story id; defines the story name/elevation, floor-diaphragm flag, and the wind and seismic… |
| `db/STRPSSM` | POST, GET, PUT, DELETE | Assign |  | Section Manager - Stress Points (STRPSSM). Defines additional (user) stress-check points at the i-end (POINT1) and j-end (POINT2) of a… |
| `db/STYP` | GET, PUT | Assign | Structure Type | Structure Type (STYP). Single project-wide record (key is always 1) defining the analysis structure type, mass control, gravity, initial… |
| `db/STYP-M1` | GET, PUT | Assign |  | Structure Type (STYP-M1). Global structure-type/gravity/temperature settings plus the MASS_CONTROL sub-object whose MASS_TYPE and… |
| `db/SWIND` | POST, GET, PUT, DELETE | Assign |  | Story Wind Load (SWIND). WIND_CODE selects the wind code variant and its per-code inputs are flattened to the top level; only… |
| `db/TDCS` | POST, GET, PUT, DELETE | Assign | Tendon Location for Composite Section | Tendon Location for Composite Section (TDCS). Assigns the tendon profile, the composite section used for the construction stage, and the… |
| `db/TDGR` | POST, GET, PUT, DELETE | Assign | Define Tendon Group | Tendon Group (TDGR). A named tendon group keyed by group id; the only field is the group name. |
| `db/TDME` | POST, GET, PUT, DELETE | Assign | Time Dependent Material (Comp. Strength) | Time Dependent Material - Compressive Strength (TDME). TYPE selects between a built-in code (CODE) whose CODENAME drives which factor… |
| `db/TDMF` | POST, GET, PUT, DELETE | Assign | Time Dependent Material (Creep/Shrinkage/Relaxation) Function | Time Dependent Material Function (TDMF). FTYPE selects the function kind; when FTYPE is CREEP the CTYPE and ELAST fields become applicable… |
| `db/TDMT` | POST, GET, PUT, DELETE | Assign | Time Dependent Material (Creep/Shrinkage) | Time Dependent Material (TDMT). The CODE field selects the design code and drives which fields apply per the OnSet switch; for the ACI code… |
| `db/TDNA` | POST, GET, PUT, DELETE | Assign | Tendon Profile | Tendon Profile (TDNA). The INPUT key (2D vs 3D) selects which profile arrays apply (PROFY+PROFZ for 2D, PROF for 3D), and the SHAPE key… |
| `db/TDNT` | POST, GET, PUT, DELETE | Assign | Tendon Property | Tendon Property (TDNT). Field applicability is driven by TYPE (internal/external), LT (pre/post-tension) and especially the relaxation… |
| `db/TDPL` | POST, GET, PUT, DELETE | Assign | Tendon Prestress Loads | Tendon Prestress Load (TDPL). Applies prestress jacking loads to tendons under a static load case; each ITEMS entry carries the load case… |
| `db/THFC` | POST, GET, PUT, DELETE | Assign |  | Time History Function (THFC). FUNCTYPE selects the function form: 1 (Time Function) uses iMETHOD/SCALE/MAXVALUE/aFUNCDATA, 2 (Sinusoidal)… |
| `db/THGA` | POST, GET, PUT, DELETE | Assign |  | Time History Ground Acceleration (THGA). Defines the ground acceleration time-history loads for a time history load case, pairing X/Y/Z… |
| `db/THGC` | POST, GET, PUT, DELETE | Assign |  | Time History Global Control (THGC). Singleton nonlinear time-history analysis global control; there is exactly one THGC record (key 1)… |
| `db/THGC-M1` | POST, GET, PUT, DELETE | Assign |  | Time History Global Control - Nonlinear (THGC-M1). A single global-control record (key is always "1"); GEO_NONL_TYPE and INIT_LOAD_TYPE… |
| `db/THIK` | POST, GET, PUT, DELETE | Assign | Thickness | Thickness (THIK). TYPE selects the thickness family (VALUE = plate thickness, STIFFENED = stiffened plate, STLWALL = steel-concrete wall)… |
| `db/THIS` | POST, GET, PUT, DELETE | Assign | Time History Load Cases | Time History Load Case (THIS). Field applicability is driven by COMMON.iATYPE (analysis type), COMMON.iAMETHOD (analysis method) and… |
| `db/THIS-M1` | POST, GET, PUT, DELETE | Assign |  | Time History Load Case (THIS-M1). Field applicability is driven by ANAL_CASE.ANAL_TYPE (Linear:0/Nonlinear:1) and ANAL_CASE.ANAL_METHOD… |
| `db/THMS` | POST, GET, PUT, DELETE | Assign |  | Multiple Support Excitation (THMS). A single ITEMS array holds one object per time history load case; each object binds a time history load… |
| `db/THNL` | POST, GET, PUT, DELETE | Assign |  | Dynamic Nodal Load (THNL). Each key is a node number; ITEMS holds one or more time-history nodal load assignments referencing an existing… |
| `db/THOO-M1` | POST, GET, PUT, DELETE | Assign |  | Time History Output Option (THOO-M1). A single-instance (key always 1) model-wide setting; OUT_OPT drives the inelastic hinge / fiber… |
| `db/THRE` | POST, GET, PUT, DELETE | Assign |  | Time History Analysis Results - Element Force (THRE). TYPE_ELEMENT (0:Beam, 1:Truss, 2:Wall) selects the element category; PROPERTY_KEY… |
| `db/THRG` | POST, GET, PUT, DELETE | Assign |  | Time History Analysis Results Graph - General Link (THRG). Defines a time-history result graph item for a General Link, keyed by item id… |
| `db/THRI` | POST, GET, PUT, DELETE | Assign |  | Time History Analysis Results - Inelastic Hinge (THRI). TYPE_ELEMENT selects the element category which fixes the meaning of PROPERTY_KEY… |
| `db/THRS` | POST, GET, PUT, DELETE | Assign |  | Time History Analysis Results (THRS). Defines a time history result graph entry for a general link (seismic control device), keyed by the… |
| `db/THSL` | POST, GET, PUT, DELETE | Assign |  | Time Varying Static Load (THSL). Links a time history load case (THIS_LCNAME) to a static load case (SLOAD) and a normal-type time history… |
| `db/TMAT` | POST, GET, PUT, DELETE | Assign | Material Link | Time Dependent Material (TMAT). Links a structural material to time-dependent property definitions by name: TDMT_NAME selects the… |
| `db/TMLD` | POST, GET, PUT, DELETE | Assign |  | Construction Stage Loads (TMLD). Defines time (day) loads applied during construction stages; the top-level key is the… |
| `db/TRFT` | POST, GET, PUT, DELETE | Assign |  | Torsional Reduction Factor (TRFT). Keyed by element id; the factor is applied per element and can only be assigned to BEAM-type elements. |
| `db/TSGR` | POST, GET, PUT, DELETE | Assign | Tapered Section Group | Tapered Section Group (TSGR). ZVAR and YVAR select the section-shape variation law along the z- and y-axes; when a variation is POLY the… |
| `db/UFIG` | GET | Assign |  | User Figure (UFIG). A DYNAGEN figure entry used for M-Connector; read-only, the single NAME field holds the figure's name as stored in the… |
| `db/ULFC` | POST, GET, PUT, DELETE | Assign | Unknown Load Factor | Unknown Load Factor Constraint (ULFC). TYPE selects the response quantity (reaction/displacement/truss/beam) constrained on object OBJ_ID… |
| `db/UNIT` | GET, PUT | Assign | Unit System | Unit System (UNIT). The single model-wide unit system; each optional field independently overrides the current force, length, heat, or… |
| `db/VBEM` | POST, GET, PUT, DELETE | Assign |  | Virtual Beam (VBEM). Each key is a virtual beam id whose two virtual section ids (VSEC1 at end i, VSEC2 at end j) define the beam's… |
| `db/VSEC` | POST, GET, PUT, DELETE | Assign |  | Virtual Section (VSEC). Defines a virtual section for a virtual beam via a centroid point, a section normal vector, and the lists of nodes… |
| `db/WIND` | POST, GET, PUT, DELETE | Assign |  | Wind Load (WIND). The WIND_CODE value selects which single code sub-object is required and consumed (e.g. |
| `db/WMAK` | POST, GET, PUT, DELETE | Assign | Modify Wall Mark Data | Wall Mark (WMAK). Groups a set of walls under a named mark; each key is the wall mark id and its value carries the mark name and the list… |
| `db/WNAT` | POST, GET, PUT, DELETE | Assign |  | Wind Load Auto Calculation (WNAT). A single entity holds a list of per-story wind items (WNAT_ITEMS); each item's STRUCT_TYPE (and for some… |
| `db/WSSF` | POST, GET, PUT, DELETE | Assign |  | Wall Stiffness Scale Factor (WSSF). The url key is the wall element ID; ITEMS holds one entry per boundary group with the per-direction… |
| `db/WVLD` | POST, GET, PUT, DELETE | Assign |  | Wave Load (WVLD). A miscellaneous wave load definition keyed by an integer id; the nested COEF (drag & inertia), CHAR (wave… |

## doc (12)

| uri | methods | body | feature | desc |
| --- | --- | --- | --- | --- |
| `doc/ANAL` | POST | Argument |  | Analysis (ANAL). Runs a structural analysis on the currently opened project; the request body selects the analysis type, and if no body is… |
| `doc/CLOSE` | POST | Argument | Close Project | Close Document (CLOSE). Closes the currently open model document; the request carries no fields (DTO_EMPTY), so the operation is driven… |
| `doc/EXIT` | POST | Argument |  | Exit Program (EXIT). Quits the MIDAS application; the request body carries no fields (DTO_EMPTY). |
| `doc/EXPORT` | POST | Argument | Export | Export Model to File (EXPORT). Exports the current model to a JSON file; the request body carries the destination file path as a string… |
| `doc/EXPORTMXT` | POST | Argument | Export | Export MXT (EXPORTMXT). The request is a single string carrying the destination file path; the handler opens that path for writing and… |
| `doc/IMPORT` | POST | Argument | Import | Import JSON File (IMPORT). Imports a JSON model file into the current document; the request body carries the absolute file path of the JSON… |
| `doc/IMPORTMXT` | POST | Argument | Merge Data File | Import MXT File (IMPORTMXT). The request is a single string: the full file-system path of the .mxt file to import into the currently open… |
| `doc/NEW` | POST | Argument | New Project | New Document (NEW). Creates a new empty MIDAS document; the request takes no meaningful body (DTO_EMPTY), so Argument is an empty object. |
| `doc/OPEN` | POST | Argument | Open Project | Open Document (OPEN). Opens an existing model file; the request body is a single string holding the absolute path of the file to open. |
| `doc/SAVE` | POST | Argument | Save | Save Document (SAVE). Saves the currently opened project to its existing file; the request takes no meaningful body (DTO_EMPTY) and fails… |
| `doc/SAVEAS` | POST | Argument | Save As | Save Document As (SAVEAS). Saves the currently open project to the file path supplied in Argument; the string value is passed directly as… |
| `doc/STAGAS` | POST | Argument | Save Current Stage As | Save Stage As (STAGAS). Exports the model at a specified construction stage to a new file; the fields specify the export file path and the… |

## ope (58)

| uri | methods | body | feature | desc |
| --- | --- | --- | --- | --- |
| `ope/ANALSTATUS` | POST | Argument |  | Analysis Status (ANALSTATUS). Reports the current analysis progress of the active model; the request carries no fields (DTO_EMPTY) and the… |
| `ope/API-RECORDER-LOAD` | POST | Argument |  | API Recorder Load (API-RECORDER-LOAD). Loads a previously recorded API request session from the given file. |
| `ope/API-RECORDER-PAUSE` | POST | Argument |  | Pause API Recorder (API-RECORDER-PAUSE). Pauses recording of API requests; the handler takes no request fields (empty request body). |
| `ope/API-RECORDER-RESET` | POST | Argument |  | API Recorder Reset (API-RECORDER-RESET). Takes no input; the handler resets the API request recorder buffer and requires no request fields. |
| `ope/API-RECORDER-RESUME` | POST | Argument |  | Resume API Request Recording (API-RECORDER-RESUME). Takes no body; the request DTO is empty and the handler simply resumes the API request… |
| `ope/API-RECORDER-SAVE` | POST | Argument |  | API Recorder Save (API-RECORDER-SAVE). Saves the recorded sequence of API requests to a file; the single string Argument is the destination… |
| `ope/APIEND` | GET | Argument |  | API End (APIEND). Terminates the running API session; the request takes no meaningful body (empty request DTO), so the Argument object… |
| `ope/APISTART` | GET | Argument |  | API Start (APISTART). Starts an API working session for the current product; the request carries no fields (DTO_EMPTY). |
| `ope/AUTOMESH` | POST | Argument | Auto-mesh Planar Area | Auto Mesh Generation (AUTOMESH). Generates a planar auto mesh from target nodes/line/planar elements; the request drives the mesher method… |
| `ope/BMLD` | POST | Argument |  | Beam Detail Analysis (BMLD). Runs the Beam Detail Analysis of one beam element for one load case/combination and returns displacement… |
| `ope/BOM` | POST | Argument |  | Bill of Material (BOM). Computes bill-of-material tables from the selected BOM item titles; the SELECTS list drives which structural… |
| `ope/CPCREATE` | POST | Argument |  | Construction Stage Create (CPCREATE). The request takes no meaningful body; posting triggers the construction-stage create command on the… |
| `ope/CPEXPORT` | POST | Argument |  | Construction Stage / CP Export (CPEXPORT). The request body is a single string giving the full destination file path; the handler opens… |
| `ope/CPUPDATEMODEL` | POST | Argument |  | Update Model (CPUPDATEMODEL). Takes no request fields; the handler clears the modified flag and runs the update-model command on the… |
| `ope/CPUPDATERESULT` | POST | Argument |  | Update Result (CPUPDATERESULT). Clears the modified flag and triggers the update-result command; the request takes no meaningful body… |
| `ope/DIVIDEELEM` | POST | Argument | Divide Elements | Divide Element (DIVIDEELEM). Divides target elements according to the chosen element type and divide method; the request drives the… |
| `ope/EDMP` | POST | Argument | Change Property | Change Element Dependent Material Property (EDMP). Assigns an element-dependent material property (Notional Size h, or Volume/Surface… |
| `ope/ELEMPAR` | POST | Argument |  | Change Element Parameters (ELEMPAR). Modifies the local axis / beta angle of selected elements; the operation performed is driven by… |
| `ope/ELEMTDNT` | POST | Argument |  | Element Tendon Coordinates (ELEMTDNT). Returns the section tendon (strand) coordinates for an element at a given position along its length… |
| `ope/GSBG` | POST | Argument |  | Bridge Girder Diagram Auto-Save (GSBG). Auto-saves bridge girder diagram graph images; the request fields under Argument drive which load… |
| `ope/GUSTFACTOR` | POST | Argument |  | Gust Effect Factor Calculation (GUSTFACTOR). Computes the along-wind gust effect factors in the X and Y directions per the KDS wind code… |
| `ope/IBFD` | POST | Argument |  | Influence Line Beam Force/Moment Data (IBFD). Returns the BEAM FORCE/MOMENT influence line: one force/moment component at a chosen position… |
| `ope/IBSD` | POST | Argument |  | Influence Line Beam Stress Data (IBSD). Returns the BEAM STRESS influence line: the combined section stress at a chosen stress point and… |
| `ope/IDSD` | POST | Argument |  | Influence Line Displacement Data (IDSD). Returns the DISPLACEMENT influence line: the displacement/rotation component at one node as a unit… |
| `ope/IELD` | POST | Argument |  | Influence Line Elastic Link Force/Moment Data (IELD). Returns the ELASTIC LINK FORCE/MOMENT influence line: one force/moment component of… |
| `ope/IGLD` | POST | Argument |  | Influence Line General Link Force/Moment Data (IGLD). Returns the GENERAL LINK FORCE/MOMENT influence line: one force/moment component of… |
| `ope/IPLD` | POST | Argument |  | Influence Line Plate Force/Moment Data (IPLD). Returns the PLATE FORCE/MOMENT influence line: one plate force/moment component at a chosen… |
| `ope/IRED` | POST | Argument |  | Influence Line Reaction Data (IRED). Returns the support REACTION influence line: the reaction component at one support node as a unit load… |
| `ope/ISSD` | POST | Argument |  | Influence Line Solid Stress Data (ISSD). Returns the SOLID STRESS influence line: one stress component at a chosen position of one solid… |
| `ope/ITRD` | POST | Argument |  | Influence Line Truss Force Data (ITRD). Returns the TRUSS AXIAL FORCE influence line of one truss element as a unit load moves along a… |
| `ope/LINEBMLD` | POST | Argument | Line Beam Loads | Line Beam Load (LINEBMLD). Adds a line/beam load to elements or along a loading line; the load geometry, direction, eccentricity… |
| `ope/MATL_DB` | GET | Argument |  | Material DB Lookup (MATL_DB). Retrieves the built-in material database name list for a given material type or design standard; the… |
| `ope/MATL_STANDARD` | GET | Argument |  | Material Standard List (MATL_STANDARD). Returns the list of available material design-standard names for a given material type; the request… |
| `ope/MEMB` | POST | Argument | Member Assignment | Define Member (MEMB). Groups frame elements into structural members; fields are driven by the assign mode (AUTO vs MANUAL) and how the… |
| `ope/MODALDAMPINGRATIO` | POST | Argument |  | Modal Damping Ratio (MODALDAMPINGRATIO). Retrieves the modal damping ratio data computed for the currently opened model; the request takes… |
| `ope/MXTCMDSHELL` | POST | Argument |  | MXT Command Shell (MXTCMDSHELL). Imports raw MXT command-shell text into the currently open project; the request body carries the MXT… |
| `ope/MXTINFO` | GET | Argument |  | Material Type Info (MXTINFO). The request takes no body; it retrieves the available material-type code/description information from the… |
| `ope/PLATE_DECK` | POST | Argument |  | Plate Deck (PLATE_DECK). Creates plate deck elements from a set of horizontal station lines; the geometry is driven by MATL_KEY, THICKNESS… |
| `ope/POSP` | POST | Argument |  | Calculate Soil Spring Property Kh (POSP). Drives Kh calculation for one or more existing soil spring properties (POSP) identified by ID… |
| `ope/PROJECTSTATUS` | GET | Argument | Project Status | Project Status (PROJECTSTATUS). Retrieves a summary of the currently opened project's model/load database entries; the request takes no… |
| `ope/SECT_DBNAME` | GET | Argument |  | Section DB Name (SECT_DBNAME). Retrieves the list of available DB (standard database) names for a given section shape; the request carries… |
| `ope/SECT_NAME` | POST | Argument |  | Section Name List (SECT_NAME). Returns the list of DB section names available for a given section shape and DB standard; driven by the… |
| `ope/SECT_SHAPE` | GET | Argument |  | Section Shape (SECT_SHAPE). Retrieves the list of available section shape names; the request takes no body and the optional {opt} path… |
| `ope/SECTCORD` | POST | Argument |  | Section Coordinates (SECTCORD). Returns the outer/inner polygon vertex coordinates of a section; driven by the target section number and a… |
| `ope/SECTPROP` | POST, GET | Argument |  | Section Property (SECTPROP). Computes/queries calculated section properties (area, moments of inertia, etc.) for section definitions; the… |
| `ope/SMARTGRAPHVALUE` | POST | Argument |  | Smart Graph Value (SMARTGRAPHVALUE). The TYPE selects which smart-graph result category to read, and the optional KEY narrows it to a… |
| `ope/SSPS` | POST | Argument | Surface Spring Supports | Surface Spring Support (SSPS). Converts selected element faces/nodes into nodal point springs or elastic links; which Boundary fields are… |
| `ope/STOR` | POST | Argument | Story | Auto Generate Story (STOR). Reads all model nodes to auto-detect story levels, then generates story data; the request fields only control… |
| `ope/STORY_IRR_PARAM` | POST, GET | Argument | Story | Story Irregularity Check Parameters (STORY_IRR_PARAM). Sets/gets the parameters used for the story irregularity check; the applicable… |
| `ope/STORY_PARAM` | POST, GET | Argument | Story | Story Parameter (STORY_PARAM). The request selects the design/check country code that drives the story parameters used by the check. |
| `ope/STORYPROP` | POST | Argument |  | Story Property (STORYPROP). Computes per-story properties (weight, elevation, loaded dimensions) for wind/seismic lateral load setup; the… |
| `ope/SWPCGIRDER_DLG` | POST | Argument |  | Pre/Post-Tensioned Composite Girder Bridge Wizard Dialog (SWPCGIRDER_DLG). Either opens the wizard dialog or loads a .wzd/.wiz file into an… |
| `ope/TEMP_TABLETYPE` | GET | Argument |  | Table Type (TEMP_TABLETYPE). Retrieves the list of available table types; the request takes no arguments (DTO_EMPTY), so the Argument body… |
| `ope/TRANSACTION-CANCEL` | POST | Argument |  | Transaction Cancel (TRANSACTION-CANCEL). Cancels the active API super-transaction, discarding its pending changes; the request takes an… |
| `ope/TRANSACTION-CLOSE` | POST | Argument |  | Close API Super-Transaction (TRANSACTION-CLOSE). The request body carries no meaningful fields (DTO_EMPTY); posting finishes and closes the… |
| `ope/TRANSACTION-OPEN` | POST | Argument |  | Transaction Open (TRANSACTION-OPEN). Starts an API super-transaction; the request takes no fields (DTO_EMPTY), so Argument is an empty… |
| `ope/USLC` | POST | Argument | Create Load Cases Using Load Combinations | Make Load Cases by Load Combination (USLC). Generates unit load cases from selected load combinations of a given design position; the… |
| `ope/UTBLTYPES` | GET | Argument |  | User Table Types (UTBLTYPES). Retrieves the list of user-defined table type names available in the current project; the request takes no… |

## post (8)

| uri | methods | body | feature | desc |
| --- | --- | --- | --- | --- |
| `post/ANL` | POST | Argument |  | Create Analysis Model File (ANL_REQUEST). Exports an ANL analysis-model file for the given output load set; EXPORT_PATH and LOAD_SET are… |
| `post/CHART` | POST | Argument |  | Chart (CHART). Generates or retrieves a user chart (UCHT) and returns its tabular data; the request either builds a new chart when… |
| `post/PM` | POST | Argument |  | P-M Interaction Curve (PM). Computes the design axial-moment (Phi*Pn, Phi*Mn) interaction data per element from the analysis and RC design… |
| `post/RCBEAMCHKRATIO` | POST | Argument |  | RC Beam Checking Ratio (RCBEAMCHKRATIO). Business-logic endpoint that takes no request input; it reads the current model's analysis results… |
| `post/RCWALLDGNRATIO` | POST | Argument |  | RC Wall Design Ratio (RCWALLDGNRATIO). Takes no request body; the operation reads the current model's analysis results and returns RC wall… |
| `post/STEELCODECHECK` | POST | Argument | Steel Code Check | Steel Code Check (STEELCODECHECK). Performs a steel code check on the analyzed model and returns section/element check results; the request… |
| `post/TABLE` | POST | Argument |  | Result Table (TABLE). Extracts a result/output table by TABLE_TYPE (created on the fly) or by an existing TABLE_NAME; the selection… |
| `post/TEXT` | POST | Argument | Text Output | Time History / Pushover Text Result (TEXT). The requested result table is driven by TEXT_TYPE (which analysis result to extract as text)… |

## requestinfo (3)

| uri | methods | body | feature | desc |
| --- | --- | --- | --- | --- |
| `requestinfo/POST/TABLE` | GET | Argument |  | Table Request Info (TABLE). Returns a description of the request body accepted by POST/TABLE; the request itself takes no fields… |
| `requestinfo/POST/TABLE_REQUEST` | POST | Argument |  | Table Request Info (TABLE_REQUEST). The request DTO is DTO_EMPTY, so no request body fields are consumed; send an empty Argument object. |
| `requestinfo/POST/TABLE/TYPELIST` | GET | Argument |  | Table Type List (TYPELIST). Request takes no body (DTO_EMPTY); the handler returns the list of available table types via toJsonTableTypes(). |

## view (7)

| uri | methods | body | feature | desc |
| --- | --- | --- | --- | --- |
| `view/ACTIVE` | POST | Argument | Activities | Active (ACTIVE). Controls which objects are active in the current view; ACTIVE_MODE selects the operation and drives which of the other… |
| `view/ANGLE` | POST | Argument | View Point | View Angle (ANGLE). Rotates the model view by converting horizontal and vertical angles into an axis vector; both angles drive the… |
| `view/CAPTURE` | POST | Argument | Graphic Files | View Capture (CAPTURE). Captures the current model view to an image; FIGURE_NAME selects a Smart Report figure, otherwise the supplied… |
| `view/DISPLAY` | POST | Argument | Display | Display Option (DISPLAY). Controls which model entities, boundaries, loads and view decorations are drawn in the active model window; every… |
| `view/PRECAPTURE` | POST | Argument |  | Preview Capture (PRECAPTURE). Exports a preview capture of the current model view; the fields are driven by the requested view type. |
| `view/RESULTGRAPHIC` | POST | Argument |  | Result Graphic (RESULTGRAPHIC). Renders analysis results on the model view; CURRENT_MODE selects the result type and drives which… |
| `view/SELECT` | GET | Argument | Select | Select (SELECT). Retrieves the currently selected nodes and elements in the active model view; the request takes no body fields… |

