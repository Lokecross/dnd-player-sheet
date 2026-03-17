import { useState, useEffect } from 'react'
import './App.css'

function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : defaultValue
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
            src="https://images.unsplash.com/photo-1509557965875-b88c97052f0e?auto=format&fit=crop&q=80&w=200&h=250"
            alt="Character Portrait"
          />
        </div>
        <div className="char-info">
          <div className="char-name">
            <EditableText value={data.name} onChange={(v) => update('name', v)} className="amber-text" style={{ fontSize: '36px' }} />
          </div>
          <div className="char-meta">
            <span>LVL <EditableText value={data.level} onChange={(v) => update('level', v)} size={3} /></span>
            <span>•</span>
            <span><EditableText value={data.class} onChange={(v) => update('class', v)} /></span>
            <span>•</span>
            <span><EditableText value={data.race} onChange={(v) => update('race', v)} /></span>
          </div>
          <div className="char-meta" style={{ color: 'var(--text-dim)', fontSize: '16px' }}>
            BACKGROUND: <EditableText value={data.background} onChange={(v) => update('background', v)} style={{ fontSize: '16px', color: 'var(--text-dim)' }} />
          </div>
        </div>
      </div>

      <div className="vitality-block">
        <div className="hp-numbers">
          <span className="label">VITALITY</span>
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
            TEMP HP: <EditableText value={data.tempHp} onChange={(v) => update('tempHp', v)} className="amber-text" style={{ fontSize: '16px' }} size={3} />
          </span>
          <span className="label" style={{ fontSize: '16px' }}>
            HIT DICE: <EditableText value={data.hitDice} onChange={(v) => update('hitDice', v)} className="value" style={{ fontSize: '18px' }} size={4} />
          </span>
        </div>
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
    <Panel header="ATTRIBUTES">
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
    <Panel header="THE ARCHIVES">
      <div className="text-block">
        <span className="label">TRAITS & FEATURES</span>
        <EditableArea
          value={data.traits}
          onChange={(v) => update('traits', v)}
          style={{ color: 'var(--text-bone)', fontSize: '18px', lineHeight: 1.5 }}
        />
      </div>

      <div className="divider" />

      <div className="text-block">
        <span className="label">INVENTORY</span>
        <EditableArea
          value={data.inventory}
          onChange={(v) => update('inventory', v)}
          style={{ color: 'var(--text-dim)', fontSize: '18px', lineHeight: 1.5 }}
        />
      </div>
    </Panel>
  )
}

function SkillRow({ name, mod, proficiency, attr, amberMod, onModChange, onNameChange }) {
  const pipClass = `prof-pip${proficiency === 'active' ? ' active' : ''}${proficiency === 'exp' ? ' exp' : ''}`

  return (
    <div className="skill-row">
      <div className="skill-name">
        <span className={pipClass} />
        {onNameChange ? (
          <EditableText value={name} onChange={onNameChange} style={{ fontSize: '20px' }} />
        ) : (
          name
        )}
        {attr && <span className="skill-attr">{attr}</span>}
      </div>
      <div className={`skill-mod${amberMod ? ' amber-text' : ''}`}>
        <EditableText
          value={mod}
          onChange={onModChange}
          className={amberMod ? 'amber-text' : ''}
          style={{ fontSize: '22px', textAlign: 'right', width: '36px' }}
          size={4}
        />
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
    <Panel header="PROFICIENCIES">
      <span className="section-label">SAVING THROWS</span>
      <div className="skill-list" style={{ marginBottom: '24px' }}>
        {saves.map((s, i) => (
          <SkillRow key={s.name} {...s} onModChange={(v) => updateSave(i, v)} />
        ))}
      </div>

      <span className="section-label">NOTABLE SKILLS</span>
      <div className="skill-list">
        {skills.map((s, i) => (
          <SkillRow
            key={i}
            {...s}
            onModChange={(v) => updateSkill(i, 'mod', v)}
            onNameChange={(v) => updateSkill(i, 'name', v)}
          />
        ))}
      </div>

      <div className="divider" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div className="label" style={{ fontSize: '16px' }}>
          PASSIVE PERCEPTION: <EditableText value={profData.passivePerception} onChange={(v) => setProfData({ ...profData, passivePerception: v })} className="value" style={{ marginLeft: '8px', fontSize: '16px' }} size={3} />
        </div>
        <div className="label" style={{ fontSize: '16px' }}>
          LANGUAGES:{' '}
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

  return (
    <Panel header="ACTIONS">
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
                <EditableText value={w.type} onChange={(v) => updateWeapon(i, 'type', v)} className="weapon-type" style={{ fontSize: '16px', color: 'var(--text-dim)', textAlign: 'right' }} />
              </div>
              <div style={{ marginTop: '6px' }}>
                <EditableArea
                  value={w.description}
                  onChange={(v) => updateWeapon(i, 'description', v)}
                  style={{ fontSize: '16px', color: 'var(--text-dim)', lineHeight: 1.4 }}
                />
              </div>
              <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="label">USES:</span>
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
              <EditableText value={w.type} onChange={(v) => updateWeapon(i, 'type', v)} className="weapon-type" style={{ fontSize: '16px', color: 'var(--text-dim)', textAlign: 'right' }} />
            </div>
            <div className="weapon-stats">
              <div className="weapon-stat-group">
                <span className="label">ATK</span>
                <EditableText value={w.atk} onChange={(v) => updateWeapon(i, 'atk', v)} className="value" style={{ fontSize: '22px' }} size={4} />
              </div>
              <div className="weapon-stat-group">
                <span className="label">DMG</span>
                <EditableText value={w.dmg} onChange={(v) => updateWeapon(i, 'dmg', v)} className="value" style={{ fontSize: '22px' }} size={7} />
              </div>
              <div className="weapon-stat-group">
                <span className="label">TYPE</span>
                <EditableText value={w.dmgType} onChange={(v) => updateWeapon(i, 'dmgType', v)} style={{ fontSize: '22px', color: 'var(--text-bone)' }} />
              </div>
            </div>
          </div>
        )
      })}
    </Panel>
  )
}

function ArcanaPanel({ arcana, setArcana }) {
  const update = (key, val) => setArcana({ ...arcana, [key]: val })

  return (
    <Panel header="ARCANA">
      <div className="resource-track">
        <span className="label" style={{ width: '100px' }}>PACT SLOTS</span>
        <span className="value" style={{ fontSize: '20px', marginRight: '8px' }}>
          LVL <EditableText value={arcana.pactLevel} onChange={(v) => update('pactLevel', v)} className="value" style={{ fontSize: '20px' }} size={2} />
        </span>
        <Pips
          total={arcana.pactTotal}
          filled={arcana.pactFilled}
          onToggle={(idx) => update('pactFilled', idx < arcana.pactFilled ? idx : idx + 1)}
        />
      </div>

      <div className="text-block" style={{ marginTop: '16px' }}>
        <span className="label">CANTRIPS</span>
        <EditableArea
          value={arcana.cantrips}
          onChange={(v) => update('cantrips', v)}
          style={{ color: 'var(--text-dim)', fontSize: '18px', lineHeight: 1.5 }}
        />

        <span className="label">SPELLS KNOWN</span>
        <EditableArea
          value={arcana.spells}
          onChange={(v) => update('spells', v)}
          style={{ color: 'var(--text-dim)', fontSize: '18px', lineHeight: 1.5 }}
        />
      </div>

      <div className="divider" />

      <div className="text-block">
        <span className="label">INVOCATIONS</span>
        <EditableArea
          value={arcana.invocations}
          onChange={(v) => update('invocations', v)}
          style={{ color: 'var(--text-bone)', fontSize: '18px', lineHeight: 1.5 }}
        />
      </div>
    </Panel>
  )
}

function App() {
  const [identity, setIdentity] = useLocalStorage('dnd-identity', {
    name: 'MORGATH',
    level: '5',
    class: 'WARLOCK',
    race: 'UNDEAD',
    background: 'HAUNTED ONE',
    hpCurrent: '38',
    hpMax: '45',
    tempHp: '12',
    hitDice: '5d8',
  })

  const [combatStats, setCombatStats] = useLocalStorage('dnd-combat', [
    { label: 'ARMOR', value: '14' },
    { label: 'INIT', value: '+2' },
    { label: 'SPEED', value: '30' },
    { label: 'PROF', value: '+3', amber: true },
  ])

  const [stats, setStats] = useLocalStorage('dnd-stats', [
    { name: 'STR', mod: '-1', score: '08' },
    { name: 'DEX', mod: '+2', score: '14' },
    { name: 'CON', mod: '+3', score: '16' },
    { name: 'INT', mod: '+1', score: '12' },
    { name: 'WIS', mod: '0', score: '10' },
    { name: 'CHA', mod: '+4', score: '18', primary: true },
  ])

  const [archives, setArchives] = useLocalStorage('dnd-archives', {
    traits: 'Grave Touched\nYou do not need to eat, drink, or breathe.\n\nHeart of Darkness\nThose who look into your eyes see their own demise. Advantage on intimidation against beasts.',
    inventory: "Scholar's Pack, Component Pouch, A blackened locket containing ash, 2x Potions of Healing (red liquid swirls lazily), 45 Gold Pieces.",
  })

  const [saves, setSaves] = useLocalStorage('dnd-saves', [
    { name: 'STR', mod: '-1' },
    { name: 'DEX', mod: '+2' },
    { name: 'CON', mod: '+3' },
    { name: 'INT', mod: '+1' },
    { name: 'WIS', mod: '+3', proficiency: 'active', amberMod: true },
    { name: 'CHA', mod: '+7', proficiency: 'active', amberMod: true },
  ])

  const [skills, setSkills] = useLocalStorage('dnd-skills', [
    { name: 'Arcana', mod: '+4', proficiency: 'active', attr: 'INT' },
    { name: 'Deception', mod: '+7', proficiency: 'active', attr: 'CHA' },
    { name: 'Intimidation', mod: '+10', proficiency: 'exp', attr: 'CHA', amberMod: true },
    { name: 'Perception', mod: '0', attr: 'WIS' },
    { name: 'Religion', mod: '+4', proficiency: 'active', attr: 'INT' },
  ])

  const [profData, setProfData] = useLocalStorage('dnd-prof', {
    passivePerception: '10',
    languages: 'Common, Abyssal, Deep Speech',
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

  const [arcana, setArcana] = useLocalStorage('dnd-arcana', {
    pactLevel: '3',
    pactTotal: 2,
    pactFilled: 1,
    cantrips: 'Eldritch Blast, Toll the Dead, Mage Hand',
    spells: 'Armor of Agathys, Hex, Bane, Blindness/Deafness, Fear, Phantom Steed, Vampiric Touch.',
    invocations: 'Agonizing Blast\nAdd CHA mod (+4) to Eldritch Blast damage.\n\nRepelling Blast\nPushes creature 10ft on blast hit.\n\nTomb of Levistus\nReaction: Encased in ice, gain 50 Temp HP, vulnerability to fire until next turn.',
  })

  return (
    <main className="desktop-container">
      <div className="column">
        <IdentityPanel data={identity} setData={setIdentity} />
        <AttributesPanel combatStats={combatStats} setCombatStats={setCombatStats} stats={stats} setStats={setStats} />
        <ArchivesPanel data={archives} setData={setArchives} />
      </div>

      <div className="column">
        <ProficienciesPanel saves={saves} setSaves={setSaves} skills={skills} setSkills={setSkills} profData={profData} setProfData={setProfData} />
      </div>

      <div className="column">
        <ActionsPanel weapons={weapons} setWeapons={setWeapons} />
        <ArcanaPanel arcana={arcana} setArcana={setArcana} />
      </div>
    </main>
  )
}

export default App
