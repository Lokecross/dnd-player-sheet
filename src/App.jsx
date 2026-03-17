import { useState, useEffect } from 'react'
import './App.css'

function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      if (!saved) return defaultValue
      const parsed = JSON.parse(saved)
      // Merge defaults for objects so new fields get default values
      if (defaultValue && typeof defaultValue === 'object' && !Array.isArray(defaultValue)) {
        return { ...defaultValue, ...parsed }
      }
      return parsed
    } catch {
      return defaultValue
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

function EditableText({ value, onChange, className, style, size }) {
  const width = size || Math.max(value.length, 1)
  return (
    <input
      type="text"
      className={`editable-input ${className || ''}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ ...style, width: `${width}ch` }}
    />
  )
}

function EditableArea({ value, onChange, className, style }) {
  return (
    <textarea
      className={`editable-input editable-textarea ${className || ''}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={style}
      rows={Math.max(value.split('\n').length, 2)}
    />
  )
}

function Panel({ header, children }) {
  return (
    <section className="panel">
      <div className="corner-decor tl" />
      <div className="corner-decor tr" />
      <div className="corner-decor bl" />
      <div className="corner-decor br" />
      {header && <div className="panel-header">{header}</div>}
      <div className="panel-content">{children}</div>
    </section>
  )
}

function IdentityPanel({ data, setData }) {
  const update = (key, val) => setData({ ...data, [key]: val })

  return (
    <Panel>
      <div className="identity-grid">
        <div className="portrait-container">
          <img
            src={data.portraitUrl || 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?auto=format&fit=crop&q=80&w=200&h=250'}
            alt="Retrato do Personagem"
          />
          <div className="portrait-url-edit">
            <EditableText value={data.portraitUrl} onChange={(v) => update('portraitUrl', v)} style={{ fontSize: '10px', color: 'var(--text-dim)', width: '96px' }} size={12} />
          </div>
        </div>
        <div className="char-info">
          <div className="char-name">
            <EditableText value={data.name} onChange={(v) => update('name', v)} className="amber-text" style={{ fontSize: '36px' }} />
          </div>
          <div className="char-meta">
            <span>NVL <EditableText value={data.level} onChange={(v) => update('level', v)} size={3} /></span>
            <span>•</span>
            <span><EditableText value={data.class} onChange={(v) => update('class', v)} /></span>
            <span>•</span>
            <span><EditableText value={data.race} onChange={(v) => update('race', v)} /></span>
            <span>•</span>
            <span><EditableText value={data.alignment} onChange={(v) => update('alignment', v)} /></span>
          </div>
          <div className="char-meta" style={{ color: 'var(--text-dim)', fontSize: '16px' }}>
            <span>ANTECEDENTE: <EditableText value={data.background} onChange={(v) => update('background', v)} style={{ fontSize: '16px', color: 'var(--text-dim)' }} /></span>
            <span>•</span>
            <span>XP: <EditableText value={data.xp} onChange={(v) => update('xp', v)} style={{ fontSize: '16px', color: 'var(--text-dim)' }} size={6} /></span>
          </div>
          <div className="char-meta" style={{ fontSize: '16px', marginTop: '2px' }}>
            <span className="inspiration-toggle" onClick={() => update('inspiration', data.inspiration ? 0 : 1)} style={{ cursor: 'pointer' }}>
              <span className={`pip${data.inspiration ? ' filled' : ''}`} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '6px' }} />
              <span className="label">INSPIRACAO</span>
            </span>
          </div>
        </div>
      </div>

      <div className="vitality-block">
        <div className="hp-numbers">
          <span className="label">VITALIDADE</span>
          <div>
            <EditableText value={data.hpCurrent} onChange={(v) => update('hpCurrent', v)} className="hp-current-input" style={{ fontSize: '32px', color: 'var(--text-blood)' }} size={4} />
            <span className="hp-max">/ <EditableText value={data.hpMax} onChange={(v) => update('hpMax', v)} style={{ fontSize: '20px', color: 'var(--text-dim)' }} size={3} /></span>
          </div>
        </div>
        <div className="hp-bar-container">
          <div className="hp-bar-fill" style={{ width: `${Math.min(100, Math.max(0, (parseInt(data.hpCurrent) || 0) / (parseInt(data.hpMax) || 1) * 100))}%` }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <span className="label" style={{ fontSize: '16px' }}>
            PV TEMP: <EditableText value={data.tempHp} onChange={(v) => update('tempHp', v)} className="amber-text" style={{ fontSize: '16px' }} size={3} />
          </span>
          <span className="label" style={{ fontSize: '16px' }}>
            DADOS DE VIDA: <EditableText value={data.hitDice} onChange={(v) => update('hitDice', v)} className="value" style={{ fontSize: '18px' }} size={4} />
          </span>
        </div>
      </div>

      <div className="death-exhaustion-block">
        <div className="death-saves-row">
          <span className="label">TESTES CONTRA MORTE</span>
          <div className="death-saves-pips">
            <span className="label" style={{ fontSize: '14px', color: 'var(--text-bone)' }}>SUCESSO</span>
            <Pips total={3} filled={data.deathSuccess} onToggle={(idx) => update('deathSuccess', idx < data.deathSuccess ? idx : idx + 1)} />
            <span className="label" style={{ fontSize: '14px', color: 'var(--text-blood)' }}>FALHA</span>
            <Pips total={3} filled={data.deathFail} onToggle={(idx) => update('deathFail', idx < data.deathFail ? idx : idx + 1)} />
          </div>
        </div>
        <div className="exhaustion-row">
          <span className="label">EXAUSTAO</span>
          <Pips total={6} filled={data.exhaustion} onToggle={(idx) => update('exhaustion', idx < data.exhaustion ? idx : idx + 1)} />
        </div>
      </div>

      <div className="appearance-grid">
        <span className="label" style={{ gridColumn: '1 / -1', marginBottom: '4px' }}>APARENCIA</span>
        {[
          { key: 'age', label: 'IDADE' },
          { key: 'height', label: 'ALTURA' },
          { key: 'weight', label: 'PESO' },
          { key: 'eyes', label: 'OLHOS' },
          { key: 'hair', label: 'CABELO' },
          { key: 'skin', label: 'PELE' },
        ].map(({ key: field, label }) => (
          <div className="appearance-field" key={field}>
            <span className="label" style={{ fontSize: '12px' }}>{label}</span>
            <EditableText value={data[field]} onChange={(v) => update(field, v)} style={{ fontSize: '16px', color: 'var(--text-bone)' }} size={8} />
          </div>
        ))}
      </div>
    </Panel>
  )
}

function AttributesPanel({ combatStats, setCombatStats, stats, setStats }) {
  const updateCombat = (i, val) => {
    const next = [...combatStats]
    next[i] = { ...next[i], value: val }
    setCombatStats(next)
  }

  const updateStat = (i, key, val) => {
    const next = [...stats]
    next[i] = { ...next[i], [key]: val }
    setStats(next)
  }

  return (
    <Panel header="ATRIBUTOS">
      <div className="combat-grid">
        {combatStats.map((s, i) => (
          <div className="combat-box" key={s.label}>
            <span className="label">{s.label}</span>
            <EditableText
              value={s.value}
              onChange={(v) => updateCombat(i, v)}
              className={`value${s.amber ? ' amber-text' : ''}`}
              style={{ fontSize: '32px', color: 'var(--text-amber)', lineHeight: 1, marginTop: '4px', textAlign: 'center' }}
              size={3}
            />
          </div>
        ))}
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div
            className="stat-box"
            key={s.name}
            style={s.primary ? { borderColor: 'var(--border-gold)' } : undefined}
          >
            <div className={`label${s.primary ? ' amber-text' : ''}`}>{s.name}</div>
            <div className={`stat-mod${s.primary ? ' amber-text' : ''}`}>
              <EditableText
                value={s.mod}
                onChange={(v) => updateStat(i, 'mod', v)}
                className={s.primary ? 'amber-text' : ''}
                style={{ fontSize: '38px', textShadow: '2px 2px 0 var(--bg-void)', lineHeight: 1, textAlign: 'center' }}
                size={3}
              />
            </div>
            <div className="stat-score">
              <EditableText
                value={s.score}
                onChange={(v) => updateStat(i, 'score', v)}
                className="amber-text"
                style={{ fontSize: '16px', textAlign: 'center' }}
                size={3}
              />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function ArchivesPanel({ data, setData }) {
  const update = (key, val) => setData({ ...data, [key]: val })

  return (
    <Panel header="ARQUIVOS">
      <div className="text-block">
        <span className="label">TRACOS & HABILIDADES</span>
        <EditableArea
          value={data.traits}
          onChange={(v) => update('traits', v)}
          style={{ color: 'var(--text-bone)', fontSize: '18px', lineHeight: 1.5 }}
        />
      </div>

      <div className="divider" />

      <div className="text-block">
        <span className="label">TALENTOS</span>
        <EditableArea
          value={data.feats}
          onChange={(v) => update('feats', v)}
          style={{ color: 'var(--text-bone)', fontSize: '18px', lineHeight: 1.5 }}
        />
      </div>

      <div className="divider" />

      <div className="currency-row">
        <span className="label" style={{ width: '100%', marginBottom: '6px' }}>MOEDAS</span>
        {[
          { key: 'cp', label: 'PC' },
          { key: 'sp', label: 'PP' },
          { key: 'ep', label: 'PE' },
          { key: 'gp', label: 'PO' },
          { key: 'pp', label: 'PL' },
        ].map(({ key, label }) => (
          <div className="currency-field" key={key}>
            <span className="label" style={{ fontSize: '14px' }}>{label}</span>
            <EditableText value={data[key]} onChange={(v) => update(key, v)} style={{ fontSize: '20px', color: key === 'gp' ? 'var(--text-amber)' : 'var(--text-bone)', textAlign: 'center' }} size={5} />
          </div>
        ))}
      </div>

      <div className="divider" />

      <div className="text-block">
        <span className="label">INVENTARIO</span>
        <EditableArea
          value={data.inventory}
          onChange={(v) => update('inventory', v)}
          style={{ color: 'var(--text-dim)', fontSize: '18px', lineHeight: 1.5 }}
        />
      </div>

      <div className="divider" />

      <div className="text-block">
        <span className="label">RESISTENCIAS / IMUNIDADES / VULNERABILIDADES</span>
        <EditableArea
          value={data.resistances}
          onChange={(v) => update('resistances', v)}
          style={{ color: 'var(--text-dim)', fontSize: '18px', lineHeight: 1.5 }}
        />
      </div>
    </Panel>
  )
}

function SkillRow({ name, mod, proficiency, attr, amberMod, onModChange, onNameChange, onProfChange, onRemove }) {
  const pipClass = `prof-pip${proficiency === 'active' ? ' active' : ''}${proficiency === 'exp' ? ' exp' : ''}`

  const cycleProficiency = () => {
    if (!onProfChange) return
    const cycle = { undefined: 'active', active: 'exp', exp: undefined }
    onProfChange(cycle[proficiency])
  }

  return (
    <div className="skill-row">
      <div className="skill-name">
        <span className={pipClass} onClick={cycleProficiency} style={{ cursor: 'pointer' }} />
        {onNameChange ? (
          <EditableText value={name} onChange={onNameChange} style={{ fontSize: '20px' }} />
        ) : (
          name
        )}
        {attr && <span className="skill-attr">{attr}</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className={`skill-mod${amberMod ? ' amber-text' : ''}`}>
          <EditableText
            value={mod}
            onChange={onModChange}
            className={amberMod ? 'amber-text' : ''}
            style={{ fontSize: '22px', textAlign: 'right', width: '36px' }}
            size={4}
          />
        </div>
        {onRemove && <span className="remove-btn" onClick={onRemove}>x</span>}
      </div>
    </div>
  )
}

function ProficienciesPanel({ saves, setSaves, skills, setSkills, profData, setProfData }) {
  const updateSave = (i, val) => {
    const next = [...saves]
    next[i] = { ...next[i], mod: val }
    setSaves(next)
  }

  const updateSkill = (i, key, val) => {
    const next = [...skills]
    next[i] = { ...next[i], [key]: val }
    setSkills(next)
  }

  return (
    <Panel header="PROEFICIENCIAS">
      <span className="section-label">TESTES DE RESISTENCIA</span>
      <div className="skill-list" style={{ marginBottom: '24px' }}>
        {saves.map((s, i) => (
          <SkillRow key={s.name} {...s} onModChange={(v) => updateSave(i, v)} onProfChange={(v) => { const next = [...saves]; next[i] = { ...next[i], proficiency: v }; setSaves(next) }} />
        ))}
      </div>

      <span className="section-label">PERICIAS NOTAVEIS</span>
      <div className="skill-list">
        {skills.map((s, i) => (
          <SkillRow
            key={i}
            {...s}
            onModChange={(v) => updateSkill(i, 'mod', v)}
            onNameChange={(v) => updateSkill(i, 'name', v)}
            onProfChange={(v) => updateSkill(i, 'proficiency', v)}
            onRemove={skills.length > 1 ? () => setSkills(skills.filter((_, j) => j !== i)) : undefined}
          />
        ))}
      </div>
      <button className="add-btn" onClick={() => setSkills([...skills, { name: 'Nova Pericia', mod: '+0', attr: 'ATTR' }])}>+ ADICIONAR PERICIA</button>

      <div className="divider" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="label" style={{ fontSize: '16px' }}>
          PERCEPCAO PASSIVA: <EditableText value={profData.passivePerception} onChange={(v) => setProfData({ ...profData, passivePerception: v })} className="value" style={{ marginLeft: '8px', fontSize: '16px' }} size={3} />
        </div>
        <div className="label" style={{ fontSize: '16px' }}>
          IDIOMAS:{' '}
          <EditableText
            value={profData.languages}
            onChange={(v) => setProfData({ ...profData, languages: v })}
            style={{ color: 'var(--text-bone)', textTransform: 'none', marginLeft: '8px', fontSize: '16px' }}
          />
        </div>
      </div>
    </Panel>
  )
}

function Pips({ total, filled, onToggle }) {
  return (
    <div className="pips">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`pip${i < filled ? ' filled' : ''}`}
          onClick={() => onToggle && onToggle(i)}
          style={onToggle ? { cursor: 'pointer' } : undefined}
        />
      ))}
    </div>
  )
}

function ActionsPanel({ weapons, setWeapons }) {
  const updateWeapon = (i, key, val) => {
    const next = [...weapons]
    next[i] = { ...next[i], [key]: val }
    setWeapons(next)
  }

  const removeWeapon = (i) => {
    if (weapons.length <= 1) return
    setWeapons(weapons.filter((_, j) => j !== i))
  }

  const addWeapon = () => {
    setWeapons([...weapons, { name: 'Nova Arma', type: 'Tipo', atk: '+0', dmg: '1d6', dmgType: 'Cortante' }])
  }

  const addAbility = () => {
    setWeapons([...weapons, { name: 'Nova Habilidade', type: 'Acao', isAbility: true, description: 'Descricao', usesTotal: 3, usesFilled: 0 }])
  }

  return (
    <Panel header="ACOES">
      {weapons.map((w, i) => {
        if (w.isAbility) {
          return (
            <div
              key={i}
              className="weapon-card"
              style={{ borderColor: 'var(--border-bronze)', background: '#16100d', marginBottom: 0 }}
            >
              <div className="weapon-header" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
                <EditableText value={w.name} onChange={(v) => updateWeapon(i, 'name', v)} className="weapon-name" style={{ fontSize: '20px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <EditableText value={w.type} onChange={(v) => updateWeapon(i, 'type', v)} className="weapon-type" style={{ fontSize: '16px', color: 'var(--text-dim)', textAlign: 'right' }} />
                  {weapons.length > 1 && <span className="remove-btn" onClick={() => removeWeapon(i)}>x</span>}
                </div>
              </div>
              <div style={{ marginTop: '6px' }}>
                <EditableArea
                  value={w.description}
                  onChange={(v) => updateWeapon(i, 'description', v)}
                  style={{ fontSize: '16px', color: 'var(--text-dim)', lineHeight: 1.4 }}
                />
              </div>
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="label">USOS:</span>
                <Pips
                  total={w.usesTotal}
                  filled={w.usesFilled}
                  onToggle={(idx) => {
                    updateWeapon(i, 'usesFilled', idx < w.usesFilled ? idx : idx + 1)
                  }}
                />
              </div>
            </div>
          )
        }

        return (
          <div className="weapon-card" key={i}>
            <div className="weapon-header">
              <EditableText value={w.name} onChange={(v) => updateWeapon(i, 'name', v)} className={`weapon-name${w.amber ? ' amber-text' : ''}`} style={{ fontSize: '22px' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <EditableText value={w.type} onChange={(v) => updateWeapon(i, 'type', v)} className="weapon-type" style={{ fontSize: '16px', color: 'var(--text-dim)', textAlign: 'right' }} />
                {weapons.length > 1 && <span className="remove-btn" onClick={() => removeWeapon(i)}>x</span>}
              </div>
            </div>
            <div className="weapon-stats">
              <div className="weapon-stat-group">
                <span className="label">ATAQ</span>
                <EditableText value={w.atk} onChange={(v) => updateWeapon(i, 'atk', v)} className="value" style={{ fontSize: '22px' }} size={4} />
              </div>
              <div className="weapon-stat-group">
                <span className="label">DANO</span>
                <EditableText value={w.dmg} onChange={(v) => updateWeapon(i, 'dmg', v)} className="value" style={{ fontSize: '22px' }} size={7} />
              </div>
              <div className="weapon-stat-group">
                <span className="label">TIPO</span>
                <EditableText value={w.dmgType} onChange={(v) => updateWeapon(i, 'dmgType', v)} style={{ fontSize: '22px', color: 'var(--text-bone)' }} />
              </div>
            </div>
          </div>
        )
      })}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button className="add-btn" onClick={addWeapon}>+ ARMA</button>
        <button className="add-btn" onClick={addAbility}>+ HABILIDADE</button>
      </div>
    </Panel>
  )
}

function ArcanaPanel({ arcana, setArcana }) {
  const update = (key, val) => setArcana({ ...arcana, [key]: val })

  const updateSlot = (lvl, key, val) => {
    const next = [...arcana.spellSlots]
    next[lvl] = { ...next[lvl], [key]: val }
    update('spellSlots', next)
  }

  const ordinal = ['1o', '2o', '3o', '4o', '5o', '6o', '7o', '8o', '9o']

  return (
    <Panel header="ARCANA">
      <div className="resource-track">
        <span className="label" style={{ width: '100px' }}>ESPACOS DE PACTO</span>
        <span className="value" style={{ fontSize: '20px', marginRight: '8px' }}>
          LVL <EditableText value={arcana.pactLevel} onChange={(v) => update('pactLevel', v)} className="value" style={{ fontSize: '20px' }} size={2} />
        </span>
        <Pips
          total={arcana.pactTotal}
          filled={arcana.pactFilled}
          onToggle={(idx) => update('pactFilled', idx < arcana.pactFilled ? idx : idx + 1)}
        />
      </div>

      <div className="spell-slots-section">
        <span className="section-label" style={{ marginTop: '12px' }}>ESPACOS DE MAGIA</span>
        {arcana.spellSlots.map((slot, i) => {
          const total = parseInt(slot.total) || 0
          return (
            <div className={`spell-slot-row${total === 0 ? ' dimmed' : ''}`} key={i}>
              <span className="label" style={{ width: '36px', fontSize: '16px' }}>{ordinal[i]}</span>
              <EditableText value={slot.total} onChange={(v) => updateSlot(i, 'total', v)} style={{ fontSize: '16px', color: 'var(--text-dim)', textAlign: 'center' }} size={2} />
              {total > 0 && (
                <Pips
                  total={total}
                  filled={Math.min(slot.filled, total)}
                  onToggle={(idx) => updateSlot(i, 'filled', idx < slot.filled ? idx : idx + 1)}
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="divider" />

      <div className="text-block">
        <span className="label">TRUQUES</span>
        <EditableArea
          value={arcana.cantrips}
          onChange={(v) => update('cantrips', v)}
          style={{ color: 'var(--text-dim)', fontSize: '18px', lineHeight: 1.5 }}
        />

        <span className="label">MAGIAS CONHECIDAS</span>
        <EditableArea
          value={arcana.spells}
          onChange={(v) => update('spells', v)}
          style={{ color: 'var(--text-dim)', fontSize: '18px', lineHeight: 1.5 }}
        />
      </div>

      <div className="divider" />

      <div className="text-block">
        <span className="label">INVOCACOES</span>
        <EditableArea
          value={arcana.invocations}
          onChange={(v) => update('invocations', v)}
          style={{ color: 'var(--text-bone)', fontSize: '18px', lineHeight: 1.5 }}
        />
      </div>
    </Panel>
  )
}

const CONDITIONS = [
  'Cego', 'Enfeiticado', 'Surdo', 'Amedrontado', 'Agarrado', 'Incapacitado', 'Invisivel',
  'Paralisado', 'Petrificado', 'Envenenado', 'Caido', 'Impedido', 'Atordoado', 'Inconsciente',
]

function PersonalityPanel({ data, setData }) {
  const update = (key, val) => setData({ ...data, [key]: val })

  return (
    <Panel header="PERSONALIDADE">
      {[
        { key: 'traits', label: 'TRACOS DE PERSONALIDADE' },
        { key: 'ideals', label: 'IDEAIS' },
        { key: 'bonds', label: 'VINCULOS' },
        { key: 'flaws', label: 'DEFEITOS' },
      ].map(({ key, label }, i) => (
        <div key={key}>
          {i > 0 && <div className="divider" />}
          <div className="text-block">
            <span className="label">{label}</span>
            <EditableArea
              value={data[key]}
              onChange={(v) => update(key, v)}
              style={{ color: 'var(--text-bone)', fontSize: '18px', lineHeight: 1.5 }}
            />
          </div>
        </div>
      ))}
    </Panel>
  )
}

function ConditionsPanel({ data, setData }) {
  const toggle = (condition) => setData({ ...data, [condition]: !data[condition] })

  return (
    <Panel header="CONDICOES">
      <div className="conditions-grid">
        {CONDITIONS.map((c) => (
          <span
            key={c}
            className={`condition-badge${data[c] ? ' active' : ''}`}
            onClick={() => toggle(c)}
          >
            {c}
          </span>
        ))}
      </div>
    </Panel>
  )
}

function NotesPanel({ data, setData }) {
  const update = (key, val) => setData({ ...data, [key]: val })

  return (
    <Panel header="NOTAS">
      <div className="text-block">
        <span className="label">DIARIO</span>
        <EditableArea
          value={data.notes}
          onChange={(v) => update('notes', v)}
          style={{ color: 'var(--text-bone)', fontSize: '18px', lineHeight: 1.5 }}
        />
      </div>

      <div className="divider" />

      <div className="text-block">
        <span className="label">ALIADOS & ORGANIZACOES</span>
        <EditableArea
          value={data.allies}
          onChange={(v) => update('allies', v)}
          style={{ color: 'var(--text-dim)', fontSize: '18px', lineHeight: 1.5 }}
        />
      </div>
    </Panel>
  )
}

function Toolbar({ onExport, onImport, onReset }) {
  return (
    <div className="toolbar">
      <button className="toolbar-btn" onClick={onExport}>EXPORTAR</button>
      <label className="toolbar-btn" style={{ cursor: 'pointer' }}>
        IMPORTAR
        <input type="file" accept=".json" onChange={onImport} style={{ display: 'none' }} />
      </label>
      <button className="toolbar-btn danger" onClick={onReset}>RESETAR</button>
    </div>
  )
}

function App() {
  const [identity, setIdentity] = useLocalStorage('dnd-identity', {
    name: 'MORGATH',
    level: '5',
    class: 'WARLOCK',
    race: 'UNDEAD',
    alignment: 'CHAOTIC NEUTRAL',
    background: 'HAUNTED ONE',
    xp: '6500',
    inspiration: 0,
    hpCurrent: '38',
    hpMax: '45',
    tempHp: '12',
    hitDice: '5d8',
    deathSuccess: 0,
    deathFail: 0,
    exhaustion: 0,
    portraitUrl: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?auto=format&fit=crop&q=80&w=200&h=250',
    age: '',
    height: '',
    weight: '',
    eyes: '',
    hair: '',
    skin: '',
  })

  const [combatStats, setCombatStats] = useLocalStorage('dnd-combat', [
    { label: 'CA', value: '14' },
    { label: 'INIC', value: '+2' },
    { label: 'DESL', value: '30' },
    { label: 'PROF', value: '+3', amber: true },
  ])

  const [stats, setStats] = useLocalStorage('dnd-stats', [
    { name: 'FOR', mod: '-1', score: '08' },
    { name: 'DES', mod: '+2', score: '14' },
    { name: 'CON', mod: '+3', score: '16' },
    { name: 'INT', mod: '+1', score: '12' },
    { name: 'SAB', mod: '0', score: '10' },
    { name: 'CAR', mod: '+4', score: '18', primary: true },
  ])

  const [archives, setArchives] = useLocalStorage('dnd-archives', {
    traits: 'Grave Touched\nYou do not need to eat, drink, or breathe.\n\nHeart of Darkness\nThose who look into your eyes see their own demise. Advantage on intimidation against beasts.',
    feats: '',
    cp: '0', sp: '0', ep: '0', gp: '45', pp: '0',
    inventory: "Scholar's Pack, Component Pouch, A blackened locket containing ash, 2x Potions of Healing (red liquid swirls lazily), 45 Gold Pieces.",
    resistances: '',
  })

  const [saves, setSaves] = useLocalStorage('dnd-saves', [
    { name: 'FOR', mod: '-1' },
    { name: 'DES', mod: '+2' },
    { name: 'CON', mod: '+3' },
    { name: 'INT', mod: '+1' },
    { name: 'SAB', mod: '+3', proficiency: 'active', amberMod: true },
    { name: 'CAR', mod: '+7', proficiency: 'active', amberMod: true },
  ])

  const [skills, setSkills] = useLocalStorage('dnd-skills', [
    { name: 'Arcanismo', mod: '+4', proficiency: 'active', attr: 'INT' },
    { name: 'Enganacao', mod: '+7', proficiency: 'active', attr: 'CAR' },
    { name: 'Intimidacao', mod: '+10', proficiency: 'exp', attr: 'CAR', amberMod: true },
    { name: 'Percepcao', mod: '0', attr: 'SAB' },
    { name: 'Religiao', mod: '+4', proficiency: 'active', attr: 'INT' },
  ])

  const [profData, setProfData] = useLocalStorage('dnd-prof', {
    passivePerception: '10',
    languages: 'Comum, Abissal, Fala Profunda',
  })

  const [weapons, setWeapons] = useLocalStorage('dnd-weapons', [
    { name: 'Eldritch Blast', type: 'Spell (2 Beams)', atk: '+7', dmg: '1d10+4', dmgType: 'Force', amber: true },
    { name: 'Bone Dagger', type: 'Finesse, Light', atk: '+5', dmg: '1d4+2', dmgType: 'Pierce' },
    {
      name: 'Form of Dread', type: 'Bonus Action', isAbility: true,
      description: 'Transform for 1 min. Gain Temp HP (1d10+5). Once per turn, hit attack forces WIS save (DC 15) or Frightened.',
      usesTotal: 3, usesFilled: 2,
    },
  ])

  const [personality, setPersonality] = useLocalStorage('dnd-personality', {
    traits: '',
    ideals: '',
    bonds: '',
    flaws: '',
  })

  const [conditions, setConditions] = useLocalStorage('dnd-conditions',
    Object.fromEntries(CONDITIONS.map((c) => [c, false]))
  )

  const [notes, setNotes] = useLocalStorage('dnd-notes', {
    notes: '',
    allies: '',
  })

  const [arcana, setArcana] = useLocalStorage('dnd-arcana', {
    pactLevel: '3',
    pactTotal: 2,
    pactFilled: 1,
    spellSlots: Array.from({ length: 9 }, () => ({ total: '0', filled: 0 })),
    cantrips: 'Eldritch Blast, Toll the Dead, Mage Hand',
    spells: 'Armor of Agathys, Hex, Bane, Blindness/Deafness, Fear, Phantom Steed, Vampiric Touch.',
    invocations: 'Agonizing Blast\nAdd CHA mod (+4) to Eldritch Blast damage.\n\nRepelling Blast\nPushes creature 10ft on blast hit.\n\nTomb of Levistus\nReaction: Encased in ice, gain 50 Temp HP, vulnerability to fire until next turn.',
  })

  const handleExport = () => {
    const data = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith('dnd-')) {
        data[key] = JSON.parse(localStorage.getItem(key))
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${identity.name || 'character'}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        Object.entries(data).forEach(([key, value]) => {
          if (key.startsWith('dnd-')) {
            localStorage.setItem(key, JSON.stringify(value))
          }
        })
        window.location.reload()
      } catch {
        // invalid file
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleReset = () => {
    if (!window.confirm('Resetar todos os dados do personagem? Isso nao pode ser desfeito.')) return
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key.startsWith('dnd-')) localStorage.removeItem(key)
    }
    window.location.reload()
  }

  return (
    <>
      <Toolbar onExport={handleExport} onImport={handleImport} onReset={handleReset} />
      <main className="desktop-container">
        <div className="column">
          <IdentityPanel data={identity} setData={setIdentity} />
          <AttributesPanel combatStats={combatStats} setCombatStats={setCombatStats} stats={stats} setStats={setStats} />
          <ArchivesPanel data={archives} setData={setArchives} />
        </div>

        <div className="column">
          <ProficienciesPanel saves={saves} setSaves={setSaves} skills={skills} setSkills={setSkills} profData={profData} setProfData={setProfData} />
          <PersonalityPanel data={personality} setData={setPersonality} />
          <ConditionsPanel data={conditions} setData={setConditions} />
          <NotesPanel data={notes} setData={setNotes} />
        </div>

        <div className="column">
          <ActionsPanel weapons={weapons} setWeapons={setWeapons} />
          <ArcanaPanel arcana={arcana} setArcana={setArcana} />
        </div>
      </main>
    </>
  )
}

export default App
