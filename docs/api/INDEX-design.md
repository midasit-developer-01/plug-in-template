# 엔드포인트 인덱스 — design / rating

**이 파일은 Read 하지 말고 Grep 하세요.** 한 줄이 엔드포인트 하나입니다.

설계(design)와 내진성능평가(rating) 엔드포인트는 `<그룹>/<코드 분류>/<기준>/<이름>` 으로
중첩되고, 같은 이름이 기준마다 반복됩니다 (예: `MATD` 는 design/RC, design/PSC, design/SRC,
rating/PSC 에 각각 존재). **반드시 전체 uri 로 지정하세요.**

이 그룹에는 GUI 가이드가 없습니다 (매뉴얼에 해당 문서가 없음).

> 생성물입니다. 직접 고치지 말고 `node scripts/sync-api-docs.js` 로 다시 만드세요.

## design (177)

| uri | methods | body | feature | desc |
| --- | --- | --- | --- | --- |
| `design/PSC/AASHTO-LRFD24/DIDP` | POST, GET, PUT, DELETE | Assign |  | PSC Design Input for Design Position (DIDP). Fields select which element ends are checked for moment and shear design; both are element-end… |
| `design/PSC/AASHTO-LRFD24/DIDP-VBEAM` | POST, GET, PUT, DELETE | Assign |  | Design Input Data Position - Virtual Beam (DIDP-VBEAM). Selects which member ends (I/J) are checked for moment and shear on a PSC-design… |
| `design/PSC/AASHTO-LRFD24/DIOP` | POST, GET, PUT, DELETE | Assign |  | PSC Design Input Option per Element (DIOP). Fields drive which design checks (moment strength, shear, torsion) are performed at the I/J… |
| `design/PSC/AASHTO-LRFD24/DIOP-VBEAM` | POST, GET, PUT, DELETE | Assign |  | Design Input Option Parameter for Virtual Beam (DIOP-VBEAM). Fields set which member-end design checks (positive/negative moment, shear… |
| `design/PSC/AASHTO-LRFD24/DPSC` | POST, GET, PUT, DELETE | Assign |  | PSC Design Parameters (DPSC). Fields configure AASHTO-LRFD24 prestressed-concrete design settings: tendon/exposure/corrosion options and… |
| `design/PSC/AASHTO-LRFD24/INFS` | POST, GET, PUT, DELETE | Assign |  | Interface Shear (INFS). Surface-classification data at the I and J ends of a PSC design element; each end carries the interfacial section… |
| `design/PSC/AASHTO-LRFD24/INFS-VBEAM` | POST, GET, PUT, DELETE | Assign |  | Interface Shear parameters for a Virtual Beam (INFS-VBEAM). Fields are driven by the two nested per-end surface-classification objects (I… |
| `design/PSC/AASHTO-LRFD24/MATD` | GET, PUT, DELETE | Assign |  | PSC Design Material (MATD_PSC_ITEM). Defines girder (and optionally slab) concrete and rebar design material properties for a single… |
| `design/PSC/AASHTO-LRFD24/MEMB` | POST, GET, PUT, DELETE | Assign |  | PSC Composite Section Member for Design (MEMB). Fields define the group of elements forming one PSC design member (segment) and its… |
| `design/PSC/AASHTO-LRFD24/MEMB-VBEAM` | POST, GET, PUT, DELETE | Assign |  | PSC Virtual Beam Member (PSCMEMB). Fields are driven by the list of Virtual Beam elements grouped as one design member and its joint type. |
| `design/PSC/AASHTO-LRFD24/PSC-ANAL` | POST | Argument |  | PSC Performance Design/Rating Analysis (PSC-ANAL). The single TYPE field selects the PSC business-logic action to execute. |
| `design/PSC/AASHTO-LRFD24/REPORT` | POST | Argument |  | PSC AASHTO-LRFD24 Design Report (REPORT). Fields come from the PSC_EXCEL_REQUEST DTO and control where the generated Excel report file is… |
| `design/PSC/AASHTO-LRFD24/RPSC` | POST, GET, PUT, DELETE | Assign |  | Reinforcement of Section for PSC Design (RPSC). Fields are driven by the top-level booleans (separate I/J flags) plus the shear… |
| `design/PSC/AASHTO-LRFD24/RPSC-VBEAM` | POST, GET, PUT, DELETE | Assign |  | Reinforcement of Virtual Beam Section (RPSC-VBEAM). Fields are driven by the DTO_RPSC structure: three top-level booleans plus the… |
| `design/PSC/AASHTO-LRFD24/SECF` | POST, GET, PUT, DELETE | Assign |  | Section Stiffness Scale Factor (SECF). Holds a list of stiffness scale-factor items, each scaling section properties (area, shear areas… |
| `design/PSC/AASHTO-LRFD24/SLCT` | GET, PUT, DELETE | Assign |  | Serviceability Load Combination Type Selection (SLCT). Assigns the serviceability load type to an existing concrete service load… |
| `design/PSC/AASHTO-LRFD24/STRPSSM` | POST, GET, PUT, DELETE | Assign |  | Section Manager - Additional Stress Points (STRPSSM). Fields define additional stress-check point coordinates at the i-end (POINT1) and… |
| `design/PSC/AASHTO-LRFD24/TABLE` | POST | Argument |  | PSC Design Result Table (TABLE). Fields are driven by the TABLE_REQUEST DTO; TABLE_TYPE selects which PSC Design result table (PSC_*) is… |
| `design/PSC/DSPSC` | POST, GET, PUT, DELETE | Assign |  | PSC Design Code (DSPSC). The only field is the design code name; writes accept the AASHTO LRFD family only (National Annex is forced to… |
| `design/RC/DRC` | GET, PUT, DELETE | Assign |  | RC Design Code (DCON). The single field carries the RC concrete design code name that is validated against the supported design-code list… |
| `design/RC/KDS-41-20-2022/BC-ANAL` | POST | Argument |  | RC Beam Design Analysis (BC-ANAL). Fields select which elements or sections the design analysis is performed on, driven by PERFORM_TYPE. |
| `design/RC/KDS-41-20-2022/BC-REPORT` | POST | Argument |  |  |
| `design/RC/KDS-41-20-2022/BC-TABLE` | POST | Argument |  | Beam Check Table (BC-TABLE). Builds an RC beam design-check result table; the request fields (D_TABLE_REQUEST) drive table type, result… |
| `design/RC/KDS-41-20-2022/BD-ANAL` | POST | Argument |  | RC Beam Design Analysis (BD-ANAL). Fields are driven by the DESIGN_ANAL request DTO, which selects the design analysis target (all… |
| `design/RC/KDS-41-20-2022/BD-REPORT` | POST | Argument |  | RC Beam Design Report (BD-REPORT). Fields come from the REPORT_REQUEST DTO, which drives the report type, export target, report mode, and… |
| `design/RC/KDS-41-20-2022/BD-TABLE` | POST | Argument |  | RC Beam Design Table (BD-TABLE). Builds the RC beam design result table (KDS-41-20-2022); fields select the table layout, element/section… |
| `design/RC/KDS-41-20-2022/BEMW` | POST, GET, PUT, DELETE | Assign |  | Boundary Element for Wall (BEMW). Fields are driven by two toggles: BBNDR_ELEM_METHOD enables the boundary-element method (requiring… |
| `design/RC/KDS-41-20-2022/BRC-ANAL` | POST | Argument |  | RC Brace Design Analysis (BRC-ANAL). Fields are driven by the DESIGN_ANAL request DTO, whose PERFORM_TYPE selects whether design is… |
| `design/RC/KDS-41-20-2022/BRC-REPORT` | POST | Argument |  | RC Brace Design Report (BRC-REPORT). Fields are driven by the REPORT_REQUEST DTO: REPORT_TYPE selects the member/property report and which… |
| `design/RC/KDS-41-20-2022/BRC-TABLE` | POST | Argument |  |  |
| `design/RC/KDS-41-20-2022/BRD-ANAL` | POST | Argument |  | Brace Design Analysis (BRD-ANAL). Fields are driven by the DESIGN_ANAL request DTO, where PERFORM_TYPE selects whether all elements… |
| `design/RC/KDS-41-20-2022/BRD-REPORT` | POST | Argument |  | Brace Design Report (BRD-REPORT). Generates an RC brace design report; fields are driven by the REPORT_REQUEST DTO (report type/mode… |
| `design/RC/KDS-41-20-2022/BRD-TABLE` | POST | Argument |  | RC Brace Design Result Table (BRD-TABLE). Fields come from the D_TABLE_REQUEST DTO, which selects the brace design result table content… |
| `design/RC/KDS-41-20-2022/CC-ANAL` | POST | Argument |  | RC Column Check Design Analysis (CC-ANAL). Performs the RCS column check design analysis; fields select which elements or sections the… |
| `design/RC/KDS-41-20-2022/CC-REPORT` | POST | Argument |  | RC Column Check Report (CC-REPORT). Generates a design report file for KDS-41-20-2022 RC column checking; fields are driven by the… |
| `design/RC/KDS-41-20-2022/CC-TABLE` | POST | Argument |  | RC Column Check Design Table (CC-TABLE). Fields come from the D_TABLE_REQUEST DTO, which drives what design-check result rows are extracted… |
| `design/RC/KDS-41-20-2022/CD-ANAL` | POST | Argument |  | RC Column Design Analysis (CD-ANAL). Fields are driven by the DESIGN_ANAL request DTO, where PERFORM_TYPE selects whether all elements… |
| `design/RC/KDS-41-20-2022/CD-REPORT` | POST | Argument |  | RC Column Design Report (CD-REPORT). Generates a design report file for RC column design; fields are driven by the REPORT_REQUEST DTO… |
| `design/RC/KDS-41-20-2022/CD-TABLE` | POST | Argument |  | RC Column Design Table (CD-TABLE). Builds the RCS column design result table; fields come from the D_TABLE_REQUEST DTO wrapped in Argument. |
| `design/RC/KDS-41-20-2022/CDESIGN` | POST | Argument |  | Capture Design View (CDESIGN). Captures the model/design result view to an image; fields mirror the CAPTURE business-logic DTO (view setup… |
| `design/RC/KDS-41-20-2022/CMFT` | POST, GET, PUT, DELETE | Assign |  | Equivalent Moment Correction Factor Cm (CMFT). When OPT_AUTO is false, the manual correction factors CMY and CMZ (each in the range 0.0 to… |
| `design/RC/KDS-41-20-2022/DCO` | GET, PUT, DELETE | Assign |  | Design Code - Concrete (DCO). Fields are driven by DESIGN_CD plus the seismic and torsion toggles: SEISMIC_PROV enables the nested SEISMIC… |
| `design/RC/KDS-41-20-2022/DCRE` | POST, GET, PUT, DELETE | Assign |  | Design Criteria for RC Rebar (DCRE). Fields are grouped by structural member type (BEAM, COLUMN, BRACE, WALL); each member sub-object… |
| `design/RC/KDS-41-20-2022/DCREM` | POST, GET, PUT, DELETE | Assign |  | Design Consideration of Rebar at Equalized Members (DCREM). Fields are driven by SELECT_ALL: when true the entire model is auto-scanned and… |
| `design/RC/KDS-41-20-2022/DCRM` | POST, GET, PUT, DELETE | Assign |  | Design Criteria for Rebar per Member (DCRM). Each element key optionally carries one or more member-type criteria blocks (BEAM, COLUMN… |
| `design/RC/KDS-41-20-2022/DCRM-BEAM` | POST, GET, PUT, DELETE | Assign |  | Design Criteria for RC Beam Member (DCRMB). Defines the rebar sizes, stirrup arrangement and reinforced-concrete design options used when… |
| `design/RC/KDS-41-20-2022/DCRM-BRACE` | POST, GET, PUT, DELETE | Assign |  | Design Criteria for Rebar - Brace (DCRM-BRACE). Fields set the main/tie rebar sizes, Y/Z rebar arrangement counts, cover distance… |
| `design/RC/KDS-41-20-2022/DCRM-COLUMN` | POST, GET, PUT, DELETE | Assign |  | Design Criteria for RC Member - Column (DCRMC). Fields set the rebar sizes, per-direction arrangement, cover distance, spacing-limit check… |
| `design/RC/KDS-41-20-2022/DCRM-WALL` | POST, GET, PUT, DELETE | Assign |  | Design Rebar Criteria for Wall (DCRMW). Keyed by Wall ID; each item carries the per-story wall rebar design criteria… |
| `design/RC/KDS-41-20-2022/DCTL` | GET, PUT, DELETE | Assign |  | Design Control (DCTL). Fields set the frame sway classification, effective length factor mode, and design type for the RC design control… |
| `design/RC/KDS-41-20-2022/DFBA` | POST, GET, PUT, DELETE | Assign |  | Design Force Basis / Force Type (DFBA). The force basis used for RC design is driven by FORCE_TYPE. |
| `design/RC/KDS-41-20-2022/EQCT` | POST, GET, PUT, DELETE | Assign |  | Seismic Load Combination Member Type (EQCT). The assigned member type drives the single field, selecting the seismic load case applied to… |
| `design/RC/KDS-41-20-2022/FMAG` | POST, GET, PUT, DELETE | Assign |  | Moment Magnifier Factors (FMAG). Holds the first- and second-order moment magnification factors about the local y and z axes; each factor… |
| `design/RC/KDS-41-20-2022/HCBM` | POST, GET, PUT, DELETE | Assign |  | Haunched Beam (HCBM). Fields describe a haunched beam design entry: a name, three element parts (A/B/C) each selected by an input method, a… |
| `design/RC/KDS-41-20-2022/HCD-ANAL` | POST | Argument |  | HC Design Analysis Element Selection (HCD-ANAL). Selects which elements the HC design analysis runs on; the element set is resolved from… |
| `design/RC/KDS-41-20-2022/HCD-REPORT` | POST | Argument |  | Haunched Beam RC Design Report (HCD-REPORT). Fields are driven by the report output settings (export destination, report mode) and the… |
| `design/RC/KDS-41-20-2022/HCD-TABLE` | POST | Argument |  | Composite Column Design Result Table (HCD-TABLE). Builds the RC composite-column (HC) design result table; all fields are optional… |
| `design/RC/KDS-41-20-2022/KFAC` | POST, GET, PUT, DELETE | Assign |  | Effective Length Factor (KFAC). Holds the effective length factors applied about each member axis for design. |
| `design/RC/KDS-41-20-2022/LCTB` | GET, DELETE | Assign |  | Load Contribution (LCTB). Fields are driven by the load contribution name, description, and the list of load contribution items (load case… |
| `design/RC/KDS-41-20-2022/LENG` | POST, GET, PUT, DELETE | Assign |  | Member Unbraced Length (LENG). Fields define the effective/unbraced lengths used in member design, keyed per element under Assign. |
| `design/RC/KDS-41-20-2022/LLRF` | GET, PUT, DELETE | Assign |  | Live Load Reduction Factor (LLRF). Fields are driven by the calculation rule (CALC_RULE): rule 0 uses the per-story reduction range… |
| `design/RC/KDS-41-20-2022/LMRR` | GET, PUT, DELETE | Assign |  | Limiting Max Rebar Ratio (LMRR). Design control values driving the limiting maximum rebar ratios for transverse rebar, longitudinal column… |
| `design/RC/KDS-41-20-2022/MATD` | GET, PUT, DELETE | Assign |  | Design Material - KDS-41-20-2022 RC (MATD_RC). Modify-only (PUT) payload patching an existing Type="C" concrete material; CONCRETE.CODE and… |
| `design/RC/KDS-41-20-2022/MBTP` | POST, GET, PUT, DELETE | Assign |  | Member Type (MBTP). Defines the structural member type used for design; driven solely by the TYPE member-type enum. |
| `design/RC/KDS-41-20-2022/MCMB` | POST, GET, PUT, DELETE | Assign |  | Member Calculation Method (MCMB). The only field is the calculation method that drives how member forces are evaluated for RC design. |
| `design/RC/KDS-41-20-2022/MEMB` | POST, GET, PUT, DELETE | Assign |  | Member Assignment (MEMB). Groups connected elements into a single design member; fields are the element list and the local-direction… |
| `design/RC/KDS-41-20-2022/MLLR` | POST, GET, PUT, DELETE | Assign |  | Moment/Load Live-Load Reduction (MLLR). Fields define a reduction factor and which member force components it is applied to. |
| `design/RC/KDS-41-20-2022/MRFT` | POST, GET, PUT, DELETE | Assign |  | Moment Redistribution Factor (MRFT). Assigned per BEAM-type element to define the moment reduction (redistribution) factor used in RC… |
| `design/RC/KDS-41-20-2022/PMDM` | POST, GET, PUT, DELETE | Assign |  | P-M Interaction Curve Calculation Method (PMDM). The field is driven by the PMDM_CALC_METHOD calculation-method enum for RC column design. |
| `design/RC/KDS-41-20-2022/REBB` | POST, GET, PUT, DELETE | Assign |  | Concrete Beam Rebar (REBB). Fields are driven by the concrete beam rebar arrangement: each item defines top/bottom main bars, shear bars… |
| `design/RC/KDS-41-20-2022/REBC` | POST, GET, PUT, DELETE | Assign |  | Rebar Input for Column Section (REBC). Fields are driven by the concrete column rebar items, each carrying main/shear rebar layouts and… |
| `design/RC/KDS-41-20-2022/REBR` | POST, GET, PUT, DELETE | Assign |  | Concrete Brace Rebar (REBR). Fields are driven by DTO_REBR: a list of brace rebar items, each carrying a main bar, end/center shear (hoop)… |
| `design/RC/KDS-41-20-2022/REBW` | POST, GET, PUT, DELETE | Assign |  | Rebar Input for Wall Section (REBW). Fields are driven by the wall rebar items list; each item carries vertical/horizontal rebar pairs plus… |
| `design/RC/KDS-41-20-2022/REXC` | POST, GET, PUT, DELETE | Assign |  | RC Exposure Condition (REXC). The exposure condition classifying the environment for reinforced concrete design. |
| `design/RC/KDS-41-20-2022/SCOL` | POST, GET, PUT, DELETE | Assign |  | Special Column (SCOL). Fields are driven by the special-column classification type used in RC seismic design. |
| `design/RC/KDS-41-20-2022/SDGN` | POST, GET, PUT, DELETE | Assign |  | Seismic Design Type (SDGN). A single Assign value object holding the seismic design classification (NTYPE) applied to the RC design… |
| `design/RC/KDS-41-20-2022/SRDF` | GET, PUT | Assign |  | Strength Reduction Factor (SRDF). All fields are optional strength reduction factors (phi) stored in the design condition (Dcon) record… |
| `design/RC/KDS-41-20-2022/SUEQ` | POST, GET, PUT, DELETE | Assign |  | Seismic Design Force Scale Factors (SUEQ). Fields are per-member scale factors applied to the earthquake load case and load combination… |
| `design/RC/KDS-41-20-2022/TABLE` | POST | Argument |  | Result Table (TABLE). Fields describe how to build/extract a result table (TABLE_TYPE to create, or TABLE_NAME to fetch), plus per-table… |
| `design/RC/KDS-41-20-2022/TRFT` | POST, GET, PUT, DELETE | Assign |  | Torsional Reduction Factor (TRFT). Holds the single torsion reduction factor applied to a BEAM-type element; can only be assigned to BEAM… |
| `design/RC/KDS-41-20-2022/ULCT` | POST, GET, PUT, DELETE | Assign |  | Underground Load Combination Type (ULCT). The single boolean field flags whether the load combination is treated as an underground load… |
| `design/RC/KDS-41-20-2022/WC-ANAL` | POST | Argument |  | RC Wall Check Analysis (WC-ANAL). Runs KDS-41-20-2022 RC wall design checking; the request selects which walls and stories to perform the… |
| `design/RC/KDS-41-20-2022/WC-REPORT` | POST | Argument |  | Wall Check Report (WC-REPORT). Fields are driven by the DESIGN_WALL_REPORT_REQUEST DTO, whose report mode field is selected by REPORT_TYPE… |
| `design/RC/KDS-41-20-2022/WC-TABLE` | POST | Argument |  | Wall Check Result Table (WC-TABLE). Fields are driven by the wall design check table request DTO, which selects walls/stories and formats… |
| `design/RC/KDS-41-20-2022/WD-ANAL` | POST | Argument |  | Wall Design Analysis (WD-ANAL). Runs RC wall design analysis per KDS-41-20-2022; the request body selects which walls and stories to design… |
| `design/RC/KDS-41-20-2022/WD-REPORT` | POST | Argument |  | Wall Design Report (WD-REPORT). Generates and exports an RC wall design report file; fields are driven by the DESIGN_WALL_REPORT_REQUEST… |
| `design/RC/KDS-41-20-2022/WD-TABLE` | POST | Argument |  | Wall Design Result Table (WD-TABLE). Fields under Argument (W_TABLE_REQUEST) drive which walls/stories are tabulated, the sort order, and… |
| `design/RC/KDS-41-20-2022/WMAK` | POST, GET, PUT, DELETE | Assign |  | Wall Mark (WMAK). Fields are driven by the wall mark name and the list of wall IDs grouped under that mark. |
| `design/SECT` | POST, GET, PUT, DELETE | Assign |  | Section (SECT). Fields are driven by the section Type (SECTTYPE): a section carries a 'before' and 'after' geometry… |
| `design/SRC/AIK-SRC2K/BC-ANAL` | POST | Argument |  | SRC Beam-Column Design Analysis (BC-ANAL). Runs the SRC beam member check design analysis; the Argument selects which members are analyzed… |
| `design/SRC/AIK-SRC2K/BC-REPORT` | POST | Argument |  | SRC Beam Check Report (BC-REPORT). Fields come from the REPORT_REQUEST DTO: report type/mode, export destination, and the… |
| `design/SRC/AIK-SRC2K/BC-TABLE` | POST | Argument |  | SRC Beam Check Design Result Table (BC-TABLE). Fields are driven by the D_TABLE_REQUEST DTO wrapped in Argument; TABLE_TYPE selects member-… |
| `design/SRC/AIK-SRC2K/CC-ANAL` | POST | Argument |  | SRC Column Check Analysis (CC-ANAL). Fields are driven by the DESIGN_ANAL request DTO: PERFORM_TYPE selects the target scope and… |
| `design/SRC/AIK-SRC2K/CC-REPORT` | POST | Argument |  | SRC Column Check Design Report (CC-REPORT). Generates a design report file for SRC column checking; fields are driven by the REPORT_REQUEST… |
| `design/SRC/AIK-SRC2K/CC-TABLE` | POST | Argument |  | SRC Column Checking Result Table (CC-TABLE). Fields are driven by the DTO_D_TABLE_REQUEST design-table request, wrapped in Argument… |
| `design/SRC/AIK-SRC2K/CMFT` | POST, GET, PUT, DELETE | Assign |  | Equivalent Moment Correction Factor Cm (CMFT). Fields hold the auto-calculate flag and the manual Cm factors about the member local y and z… |
| `design/SRC/AIK-SRC2K/DCO` | GET, PUT, DELETE | Assign |  | SRC Design Code Options (SRCDCO). Fields set the SRC design code and whether special seismic provisions apply. |
| `design/SRC/AIK-SRC2K/DCTL` | GET, PUT, DELETE | Assign |  | Design Control Data (DCTL). Fields set the frame sway classification per direction, effective length factor auto-calculation, and the… |
| `design/SRC/AIK-SRC2K/DREULT` | POST | Argument |  | Design Result View Capture (DREULT). Captures a result-graphic view image; fields are driven by the CAPTURE business-logic DTO wrapped in… |
| `design/SRC/AIK-SRC2K/DSRC` | GET, PUT, DELETE | Assign |  | SRC Design Code (DSRC). The single field selects the SRC design code standard applied to the model. |
| `design/SRC/AIK-SRC2K/EQCT` | POST, GET, PUT, DELETE | Assign |  | Seismic Load Combination Member Type (EQCT). The single field assigns the seismic member type applied to the member. |
| `design/SRC/AIK-SRC2K/FMAG` | POST, GET, PUT, DELETE | Assign |  | Moment Magnification Factors (FMAG). Fields are the first- and second-order moment magnification factors about the Y and Z axes, each… |
| `design/SRC/AIK-SRC2K/KFAC` | POST, GET, PUT, DELETE | Assign |  | Effective Length Factor (KFAC). Fields hold the effective length factors applied about the two member axes and for torsion. |
| `design/SRC/AIK-SRC2K/LCTB` | GET, DELETE | Assign |  | Load Contribution (LCTB). Fields are driven by the load contribution name/description and its list of load-case contribution items. |
| `design/SRC/AIK-SRC2K/LENG` | POST, GET, PUT, DELETE | Assign |  | Effective/Unbraced Length (LENG). All fields describe member unbraced lengths and calculation options; every field is optional. |
| `design/SRC/AIK-SRC2K/LLRF` | GET, PUT, DELETE | Assign |  | Live Load Reduction Factor (LLRF). Fields are driven by CALC_RULE (calculation rule), the applied force components, the live load cases… |
| `design/SRC/AIK-SRC2K/LTSR` | POST, GET, PUT, DELETE | Assign |  | Limiting Slenderness Ratio (LTSR). Defines the allowable slenderness ratio limits (compression and tension) applied per element for SRC… |
| `design/SRC/AIK-SRC2K/MATD` | GET, PUT, DELETE | Assign |  | Modify SRC Design Material - AIK-SRC2K (MATD). Modify-only payload patching an existing Type="SRC" material record; each Assign value… |
| `design/SRC/AIK-SRC2K/MBTP` | POST, GET, PUT, DELETE | Assign |  | Member Type (MBTP). The member classification (TYPE) drives design member behavior; the sole field selects the member category. |
| `design/SRC/AIK-SRC2K/MCRD` | POST, GET, PUT, DELETE | Assign |  | Modify SRC Column Section Rebar Data (MCRD). Defines the main (longitudinal) and shear (hoop/tie) rebar arrangement for an SRC column… |
| `design/SRC/AIK-SRC2K/MEMB` | POST, GET, PUT, DELETE | Assign |  | Member Assignment (MEMB). Groups a connected set of elements into a single design member; AELEM lists the element ids forming the member… |
| `design/SRC/AIK-SRC2K/MLLR` | POST, GET, PUT, DELETE | Assign |  | Member Live Load Reduction (MLLR). Fields are driven by a reduction factor and the set of applied force components (axial, moment, shear). |
| `design/SRC/AIK-SRC2K/MRBD` | POST, GET, PUT, DELETE | Assign |  | Modify SRC Beam Section Rebar Data (MRBD). Fields are driven by the SRC beam rebar arrangement per node sector (I/M/J), with top/bottom… |
| `design/SRC/AIK-SRC2K/SUEQ` | POST, GET, PUT, DELETE | Assign |  | Seismic Load Scale Factors for Design (SUEQ). Scale factors applied to earthquake load-case and load-combination results (axial, moment… |
| `design/SRC/AIK-SRC2K/TABLE` | POST | Argument |  | Result Output Table (TABLE). The request is wrapped in Argument; when TABLE_TYPE is assigned a new user table of that type is created… |
| `design/STEEL/AIJ-ASD02/CBFT` | POST, GET, PUT, DELETE | Assign |  | Bending Coefficient Cb (CBFT). Keyed by element id; sets the lateral-torsional buckling bending coefficient Cb, either auto-calculated by… |
| `design/STEEL/AIJ-ASD02/CODE-ANAL` | POST | Argument |  | Steel Code Check Analysis (CODE-ANAL) for AIJ-ASD02. Runs the steel design code check over a set of targets selected by PERFORM_TYPE; the… |
| `design/STEEL/AIJ-ASD02/CODE-REPORT` | POST | Argument |  | Steel Code Check Report (CODE-REPORT) for AIJ-ASD02. The request (wrapped in Argument) selects report type, export destination, mode, and… |
| `design/STEEL/AIJ-ASD02/CODE-TABLE` | POST | Argument |  | Steel Code Checking Result Table (CODE-TABLE) for AIJ-ASD02. The D_TABLE_REQUEST DTO (wrapped in Argument) selects the code-check result… |
| `design/STEEL/AIJ-ASD02/DCTL` | GET, PUT, DELETE | Assign |  | Design Control Data (DCTL). Global steel design control settings driving frame sway classification, automatic effective length factor… |
| `design/STEEL/AIJ-ASD02/DREULT` | POST | Argument |  | Design Result View Capture (CAPTURE) for AIJ-ASD02 DREULT. Captures the AIJ-ASD02 steel design-result graphic view to an image; the handler… |
| `design/STEEL/AIJ-ASD02/HCBM` | POST, GET, PUT, DELETE | Assign |  | Haunched Beam (HCBM). Keyed by haunched-beam id; fields describe the three haunch parts (A, B, C), each specifying its member elements… |
| `design/STEEL/AIJ-ASD02/KFAC` | POST, GET, PUT, DELETE | Assign |  | Effective Length Factor (KFAC). Keyed by element id (the element must already exist in the model); sets the effective length factors about… |
| `design/STEEL/AIJ-ASD02/LCTB` | GET, DELETE | Assign |  | Load Contribution (LCTB). Read-only view of a named load contribution set whose members are load-case factor items (BASE_ITEM). |
| `design/STEEL/AIJ-ASD02/LENG` | POST, GET, PUT, DELETE | Assign |  | Member Unbraced Length (LENG). Keyed by element id (the element must already exist in the model); sets the unbraced lengths used by the… |
| `design/STEEL/AIJ-ASD02/LLRF` | GET, PUT, DELETE | Assign |  | Live Load Reduction Factor (LLRF). Single global record with key = 1, stored in the same underlying record as DCTL - set DCTL first (the… |
| `design/STEEL/AIJ-ASD02/LTSR` | POST, GET, PUT, DELETE | Assign |  | Limiting Slenderness Ratio (LTSR). Keyed by element id (the element must already exist in the model); holds the per-element allowable… |
| `design/STEEL/AIJ-ASD02/MBTP` | POST, GET, PUT, DELETE | Assign |  | Member Type (MBTP). The member's design classification, driven solely by the TYPE enum. Key = element number (the element must exist). |
| `design/STEEL/AIJ-ASD02/MEMB` | POST, GET, PUT, DELETE | Assign |  | Design Member Assignment (MEMB). Groups connected elements into a single design member, driven by the AELEM element list. |
| `design/STEEL/AIJ-ASD02/MLLR` | POST, GET, PUT, DELETE | Assign |  | Moving Load Reduction (MLLR). Defines a moving-load reduction factor and which internal force components it is applied to. |
| `design/STEEL/AIJ-ASD02/OCHECK` | POST | Argument |  | Steel Optimal Design / Section Check (OCHECK) for AIJ-ASD02. The ODS_RUN_REQUEST DTO (wrapped in Argument) gives a required section list… |
| `design/STEEL/AIJ-ASD02/SERV` | POST, GET, PUT, DELETE | Assign |  | Serviceability Parameters (SERV). Per-key deflection limit and amplification factor for the serviceability (deflection) check. |
| `design/STEEL/AIJ-ASD02/SMODI` | GET, PUT, DELETE | Assign |  | Steel Design Material Modification (SMODI). Fields are driven by CODE: when CODE is 'None' the material is user-defined (NAME, FY, ES, PS… |
| `design/STEEL/AIJ-ASD02/SUEQ` | POST, GET, PUT, DELETE | Assign |  | Scale-Up Factors of Earthquake Load (SUEQ). Per-key scale factors applied to earthquake load results, split by source (load case vs load… |
| `design/STEEL/AIJ-ASD02/TABLE` | POST | Argument |  | Result Table (TABLE) for AIJ-ASD02. Registered under the AIJ-ASD02 design-code path but served by the SAME shared handler as post/TABLE and… |
| `design/STEEL/DSTL` | GET, PUT, DELETE | Assign |  | Steel Design Code (DSTL). The single field selects the steel design code applied to the model; the input string is matched (case- and… |
| `design/STEEL/JAPAN-ROAD-II-H14/KFAC` | POST, GET, PUT, DELETE | Assign |  | Effective Buckling Length Factor - Japan Road (Steel, Part II) (KFAC). Effective length factors about the major (Ky), minor (Kz), and… |
| `design/STEEL/JAPAN-ROAD-II-H14/LENG` | POST, GET, PUT, DELETE | Assign |  | Unbraced Length - Japan Road (Steel, Part II) (LENG). Defines member unbraced lengths for buckling checks; each value is stored per… |
| `design/STEEL/JAPAN-ROAD-II-H14/LTSR` | POST, GET, PUT, DELETE | Assign |  | Limiting Slenderness Ratio - Japan Road (Steel, Part II) (LTSR). Per-element allowable slenderness ratio limits for compression and tension… |
| `design/STEEL/JAPAN-ROAD-II-H24/KFAC` | POST, GET, PUT, DELETE | Assign |  | Effective Buckling Length Factor - Japan Road (Steel, Part II) (KFAC). Effective length factors about the major (Ky), minor (Kz), and… |
| `design/STEEL/JAPAN-ROAD-II-H24/LENG` | POST, GET, PUT, DELETE | Assign |  | Unbraced Length (LENG). Unbraced lengths for Japan Road (Steel, Part II) steel design checks assigned per element; all fields are optional… |
| `design/STEEL/JAPAN-ROAD-II-H24/LTSR` | POST, GET, PUT, DELETE | Assign |  | Limiting Slenderness Ratio - Japan Road (Steel, Part II) (LTSR). Per-element allowable slenderness ratio limits for compression and tension… |
| `design/STEEL/JAPAN-ROAD-II-H29/KFAC` | POST, GET, PUT, DELETE | Assign |  | Effective Buckling Length Factor - Japan Road (Steel, Part II) (KFAC). Effective length factors about the major (Ky), minor (Kz), and… |
| `design/STEEL/JAPAN-ROAD-II-H29/LENG` | POST, GET, PUT, DELETE | Assign |  | Unbraced Length (LENG). Member unbraced-length data for Japan Road (Steel, Part II) steel design; all fields are optional overrides of the… |
| `design/STEEL/JAPAN-ROAD-II-H29/LTSR` | POST, GET, PUT, DELETE | Assign |  | Limiting Slenderness Ratio - Japan Road (Steel, Part II) (LTSR). Per-element allowable slenderness ratio limits for compression and tension… |
| `design/STEEL/JAPAN-ROAD-II-R07/KFAC` | POST, GET, PUT, DELETE | Assign |  | Effective Buckling Length Factor - Japan Road (Steel, Part II) (KFAC). Effective length factors about the major (Ky), minor (Kz), and… |
| `design/STEEL/JAPAN-ROAD-II-R07/LENG` | POST, GET, PUT, DELETE | Assign |  | Unbraced Length - Japan Road, Steel Part II (LENG). Per-element unbraced length parameters used by the Japan Road steel design check; keyed… |
| `design/STEEL/JAPAN-ROAD-II-R07/LTSR` | POST, GET, PUT, DELETE | Assign |  | Limiting Slenderness Ratio - Japan Road (Steel, Part II) (LTSR). Per-element allowable slenderness ratio limits for compression and tension… |
| `design/STEEL/KDS-41-30-2022/CBFT` | POST, GET, PUT, DELETE | Assign |  | Bending Coefficient Cb (CBFT). Fields set the lateral-torsional buckling bending coefficient Cb: either auto-calculated by the program or a… |
| `design/STEEL/KDS-41-30-2022/CMFT` | POST, GET, PUT, DELETE | Assign |  | Equivalent Moment Correction Factor Cm (CMFT). Fields set the auto-calculate flag and the manual major/minor axis moment correction factors… |
| `design/STEEL/KDS-41-30-2022/CODE-ANAL` | POST | Argument |  | Steel Code Check Analysis (CODE-ANAL). Runs the steel design code check (KDS-41-30-2022) over a set of targets selected by PERFORM_TYPE… |
| `design/STEEL/KDS-41-30-2022/CODE-REPORT` | POST | Argument |  | Steel Code Check Report (CODE-REPORT). Fields describe the report request wrapped in Argument; the report type, export destination, mode… |
| `design/STEEL/KDS-41-30-2022/CODE-TABLE` | POST | Argument |  | Steel Code Checking Result Table (CODE-TABLE). Fields are driven by the D_TABLE_REQUEST DTO, which selects the steel beam/brace/column… |
| `design/STEEL/KDS-41-30-2022/CRCM` | POST, GET, PUT, DELETE | Assign |  | Combined Strength Method (CRCM). The single field selects how directional strength components are combined for the seismic… |
| `design/STEEL/KDS-41-30-2022/DCO` | GET, PUT, DELETE | Assign |  | Steel Design Code Options (DCO). Fields describe global steel design settings; seismic-related fields (SEIS_SYS, COL_WEAK) are applied only… |
| `design/STEEL/KDS-41-30-2022/DCTL` | GET, PUT, DELETE | Assign |  | Design Control Data (DCTL). Global steel/RC/SRC design control settings driving frame sway classification, automatic effective length… |
| `design/STEEL/KDS-41-30-2022/DETAILREPORT` | POST | Argument |  | Steel Code Check Detail Report (DETAILREPORT). Generates a KDS 41 30 2022 steel design check report file; REPORT_TYPE selects whether the… |
| `design/STEEL/KDS-41-30-2022/DREULT` | POST | Argument |  | Design Result View Capture (CAPTURE). Captures the current design-result graphic view to an image; fields configure the active region, view… |
| `design/STEEL/KDS-41-30-2022/EQCT` | POST, GET, PUT, DELETE | Assign |  | Seismic Load Combination Member Type (EQCT). The single field TYPE assigns the seismic member type used by the design code combination… |
| `design/STEEL/KDS-41-30-2022/FMAG` | POST, GET, PUT, DELETE | Assign |  | Moment Magnification Factor (FMAG). Fields hold the moment magnification factors applied to first- and second-order moments about the local… |
| `design/STEEL/KDS-41-30-2022/HCBM` | POST, GET, PUT, DELETE | Assign |  | Haunched Beam (HCBM). Fields describe the three haunch parts (A, B, C), each specifying its member elements either by explicit keys or by a… |
| `design/STEEL/KDS-41-30-2022/KFAC` | POST, GET, PUT, DELETE | Assign |  | Effective Length Factor (KFAC). Effective length factors applied about the member's major (Ky), minor (Kz), and torsional (Kt) axes for… |
| `design/STEEL/KDS-41-30-2022/LCTB` | GET, DELETE | Assign |  | Load Contribution (LCTB). Defines a named load contribution set whose members are load-case factor items (BASE_ITEM). |
| `design/STEEL/KDS-41-30-2022/LENG` | POST, GET, PUT, DELETE | Assign |  | Member Unbraced Length (LENG). Fields set the unbraced lengths used by the steel/RC/SRC member design check for the element; all fields are… |
| `design/STEEL/KDS-41-30-2022/LLRF` | GET, PUT, DELETE | Assign |  | Live Load Reduction Factor (LLRF). Fields are driven by the reduction calculation rule (CALC_RULE): the RANGE_MAX/RANGE_MIN per-story… |
| `design/STEEL/KDS-41-30-2022/LTSR` | POST, GET, PUT, DELETE | Assign |  | Limiting Slenderness Ratio (LTSR). Holds the per-element allowable slenderness ratio limits for compression and tension members used in… |
| `design/STEEL/KDS-41-30-2022/MBTP` | POST, GET, PUT, DELETE | Assign |  | Member Type (MBTP). The member's design classification, driven solely by the TYPE enum. |
| `design/STEEL/KDS-41-30-2022/MEMB` | POST, GET, PUT, DELETE | Assign |  | Design Member Assignment (MEMB). Groups connected elements into a single design member; fields are driven by the element list and its… |
| `design/STEEL/KDS-41-30-2022/MLLR` | POST, GET, PUT, DELETE | Assign |  | Moving Load Reduction (MLLR). Defines a moving-load reduction factor and which internal force components it is applied to. |
| `design/STEEL/KDS-41-30-2022/REDU` | POST, GET, PUT, DELETE | Assign |  | Force Reduction Factor (REDU). Fields drive the reduction factor applied to member design forces and which force components it is applied… |
| `design/STEEL/KDS-41-30-2022/SERV` | POST, GET, PUT, DELETE | Assign |  | Serviceability Parameters (SERV). Deflection serviceability check parameters for KDS-41-30-2022 steel design; both fields are optional… |
| `design/STEEL/KDS-41-30-2022/SLRS` | POST, GET, PUT, DELETE | Assign |  | Seismic Load Resisting System (SLRS). The frame type selects the seismic system, and the check option toggles brace-slenderness / link… |
| `design/STEEL/KDS-41-30-2022/SMODI` | GET, PUT, DELETE | Assign |  | Steel Design Material Modification (SMODI). Fields are driven by CODE: when CODE is 'None' the material is user-defined (NAME, FY, ES, PS… |
| `design/STEEL/KDS-41-30-2022/SRDF` | GET, PUT, DELETE | Assign |  | Steel Resistance/Design Factors (SRDF). Holds the strength reduction (phi) factors for KDS 41 30 2022 steel design; all fields are optional… |
| `design/STEEL/KDS-41-30-2022/SUEQ` | POST, GET, PUT, DELETE | Assign |  | Seismic Design Scale Factors (SUEQ). Fields set per-value the axial, moment, and shear scale factors applied to seismic load cases and load… |
| `design/STEEL/KDS-41-30-2022/TABLE` | POST | Argument |  | Result Table (TABLE). Fields describe the request DTO that either creates a result table (when TABLE_TYPE is assigned) or fetches a saved… |
| `design/STEEL/KDS-41-30-2022/ULCT` | POST, GET, PUT, DELETE | Assign |  | Underground Load Combination Type (ULCT). The single boolean field flags whether the load combination is treated as an underground load… |

## rating (25)

| uri | methods | body | feature | desc |
| --- | --- | --- | --- | --- |
| `rating/PSC/AASHTO-LRFR19/DATR` | POST, GET, PUT, DELETE | Assign |  | Diagnostic Load Test Rating (DATR). Fields are driven by POSITION (which member end is measured) and LTM_TYPE (whether the load-test… |
| `rating/PSC/AASHTO-LRFR19/DATR-VBEAM` | POST, GET, PUT, DELETE | Assign |  | Deflection at Rating - Vehicle Beam (DATR). Fields are driven by LTM_TYPE (0=Auto Calculation, 1=User Input) and POSITION (0=I, 1=J, 2=I &… |
| `rating/PSC/AASHTO-LRFR19/DCTL` | GET, PUT, DELETE | Assign |  | Design Control Data (DCTL). Fields describe global rating design control settings: frame sway classification per direction, automatic… |
| `rating/PSC/AASHTO-LRFR19/DFRC` | POST, GET, PUT, DELETE | Assign |  | Rating Case for Load Rating Factor (DFRC). Fields describe an AASHTO LRFR19 rating case: limit state, primary/adjacent vehicle live loads… |
| `rating/PSC/AASHTO-LRFR19/KFAC` | POST, GET, PUT, DELETE | Assign |  | Effective Length Factor (KFAC). Holds the member effective length factors used in PSC rating; all fields are optional and default to 1.0. |
| `rating/PSC/AASHTO-LRFR19/LENG` | POST, GET, PUT, DELETE | Assign |  | Unbraced Length (LENG). Fields set the member unbraced lengths for AASHTO-LRFR19 PSC rating; LT (torsional unbraced length) is excluded… |
| `rating/PSC/AASHTO-LRFR19/LENG-VBEAM` | POST, GET, PUT, DELETE | Assign |  | Unbraced Length - Virtual Beam (LENG-VBEAM). All fields are optional unbraced-length values applied to a virtual beam, keyed by… |
| `rating/PSC/AASHTO-LRFR19/LTSR` | POST, GET, PUT, DELETE | Assign |  | Load Test Stress Ratio (PSCLTSR). Fields set the allowable compression/tension stress limits used when the stress check is enabled. |
| `rating/PSC/AASHTO-LRFR19/MATD` | GET, PUT, DELETE | Assign |  | Prestressed Concrete Material Design (MATD). Girder concrete/rebar always apply; slab concrete/rebar apply only when the section is a PSC… |
| `rating/PSC/AASHTO-LRFR19/MEMB` | POST, GET, PUT, DELETE | Assign |  | Member Assignment (MEMB). Groups a connected chain of elements into a single design/rating member; fields are the element list and an… |
| `rating/PSC/AASHTO-LRFR19/OPE_MEMB` | POST | Argument |  | Define Member (OPE_MEMB). Groups frame elements into members either manually from an element list or automatically, driven by the assign… |
| `rating/PSC/AASHTO-LRFR19/PFRO` | POST, GET, PUT, DELETE | Assign |  | Print Check Position for Rating Output (PFRO). The single field PART selects which member end(s) the rating output/print check applies to. |
| `rating/PSC/AASHTO-LRFR19/PFRO-VBEAM` | POST, GET, PUT, DELETE | Assign |  | Print Force at Rating Output (PFRO-VBEAM). The single field PART selects the print check position along the member, validated by the… |
| `rating/PSC/AASHTO-LRFR19/RCO` | GET, PUT, DELETE | Assign |  | Rating Code Option (RCO). Fields configure AASHTO-LRFR19 PSC rating limit states (Strength/Service stresses, load test, system factor)… |
| `rating/PSC/AASHTO-LRFR19/REPORT` | POST | Argument |  | PSC AASHTO-LRFR19 Rating Report (REPORT). Generates the PSC LRFR19 rating/design Excel report for the open project; the request fields set… |
| `rating/PSC/AASHTO-LRFR19/RPSC` | POST, GET, PUT, DELETE | Assign |  | Reinforcement of PSC Section (RPSC). Fields are driven by the longitudinal (MBARS) and shear (SBAR_ITEMS) reinforcement definitions, whose… |
| `rating/PSC/AASHTO-LRFR19/RPSC-ANAL` | POST | Argument |  | PSC Rating Analysis (RPSC-ANAL). Runs the AASHTO-LRFR19 PSC rating execution; the single Argument.TYPE field selects the analysis mode… |
| `rating/PSC/AASHTO-LRFR19/RPSC-VBEAM` | POST, GET, PUT, DELETE | Assign |  | Reinforcement of Virtual Beam Section (RPSC-VBEAM). Fields are driven by the RPSC DTO: three same-as-J/cracked flags plus… |
| `rating/PSC/AASHTO-LRFR19/RTGS` | POST, GET, PUT, DELETE | Assign |  | PSC Rating Group Setting (RTGS). Fields are driven by the selected rating group, its check position, and the condition factor for PSC load… |
| `rating/PSC/AASHTO-LRFR19/SECF` | POST, GET, PUT, DELETE | Assign |  | Section Stiffness Scale Factor (SECF). A single Assign value holds ITEMS, a list of per-boundary-group scale factor entries applied to… |
| `rating/PSC/AASHTO-LRFR19/SPLT` | POST, GET, PUT, DELETE | Assign |  | Span Length (SPLT). A single span-length value stored per database key; the only field is the span length. |
| `rating/PSC/AASHTO-LRFR19/SPLT-VBEAM` | POST, GET, PUT, DELETE | Assign |  | Span Length for V-Beam (SPLT-VBEAM). Holds the span length used by the PSC rating span-length database. |
| `rating/PSC/AASHTO-LRFR19/STRPSSM` | POST, GET, PUT, DELETE | Assign |  | Additional Stress Points Data (STRPSSM). Defines additional stress point coordinates at the i-end and j-end of a section, used by the… |
| `rating/PSC/AASHTO-LRFR19/TABLE` | POST | Argument |  | PSC Rating Result Table (AASHTO-LRFR19) (TABLE). Fields are driven by the CIVIL DTO_TABLE_REQUEST; the handler validates TABLE_TYPE as a… |
| `rating/PSC/DSRPSC` | GET, PUT, DELETE | Assign |  | PSC Rating Code (DSRPSC). A singleton database (key fixed to 1) that selects the PSC load-rating design code; the handler restricts DGNCODE… |

